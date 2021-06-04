type ResolveAndReject<T> = [(arg: T) => void, (arg: unknown) => void];

export class DataLoader<T> {
  private isLoading = false;
  private listeners: ResolveAndReject<T>[] = []

  private loadedData: T | null = null;

  constructor(
    private url: string
  ) { }

  createBoundLoadFunction(): () => Promise<T> {
    return this.load.bind(this);
  }

  load(): Promise<T> {
    if (this.loadedData !== null) {
      return Promise.resolve(this.loadedData);
    }

    this.loadDataOnce();

    return new Promise<T>((resolve, reject) => {
      this.listeners.push([resolve, reject]);
    });
  }

  private async loadDataOnce() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    try {
      this.loadedData = await (await fetch(this.url)).json() as T;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listeners.forEach(([resolve,]) => resolve(this.loadedData!));
    } catch (e) {
      this.listeners.forEach(([, reject]) => reject(e));
    }
  }
}

type AnyParameters = readonly unknown[];
type UrlBuilder<P extends AnyParameters> = (...args: P) => string;

export class ParametrizedDataLoader<T, P extends AnyParameters>{
  private loaders: { [key: string]: DataLoader<T> } = {};

  constructor(
    private urlBuilder: UrlBuilder<P>
  ) { }

  load(...args: P): Promise<T> {
    const url = this.urlBuilder(...args);

    if (this.loaders[url] == undefined) {
      this.loaders[url] = new DataLoader<T>(url);
    }

    return this.loaders[url].load();
  }

  createBoundLoadFunction(): (...args: P) => Promise<T> {
    return this.load.bind(this);
  }
}

export class PermanentlyCachingDataLoader<T, P extends AnyParameters> {
  private concurrentResolvers: {[url: string]: [[(resolved: T)=> void, (error: any) => void]]} = {};

  private constructor(
    private cache: Cache,
    private urlBuilder: UrlBuilder<P>,
  ) { }

  static async open<T, P extends AnyParameters>(
    cacheName: string,
    urlBuilder: UrlBuilder<P>
  ): Promise<PermanentlyCachingDataLoader<T, P>> {
    return new PermanentlyCachingDataLoader(await caches.open(cacheName), urlBuilder);
  }

  async load(...args: P): Promise<T | null> {
    const url = this.urlBuilder(...args);

    if(this.concurrentResolvers[url] !== undefined) {
      return new Promise<T>((resolve, reject) => {
        this.concurrentResolvers[url].push([resolve, reject]);
      });
    }else {
      this.concurrentResolvers[url] = [];
    }


    const cacheValue = await this.cache.match(url);
    if (cacheValue !== undefined) {
      const cachedJson = await cacheValue.json();
      this.concurrentResolvers[url]?.forEach(([resolve,]) => resolve(cachedJson));
      delete this.concurrentResolvers[url];
      return cachedJson;
    }

    const response = await fetch(url);
    if (response.ok) {
      this.cache.put(url, response.clone());
    }
    const cachedJson = await response.json();
    this.concurrentResolvers[url]?.forEach(([resolve,]) => resolve(cachedJson));
    delete this.concurrentResolvers[url];
    return cachedJson;
  }
}
