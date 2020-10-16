# Covid Karte (Covid Map)

 This project aims at re-implementing the features of 
 [the RKI Covid Map](https://corona.rki.de) in a more performant way.
 It's also (currently) a test on how far you can get without a 
 common UI framework like React or vue. 
 
 This corona dashboard is deployed at
 [covid-karte.de](https://covid-karte.de).

 All data is loaded from the official RKI APIs but the project
 is in no way affiliated with or endorsed by the RKI. No guarantees
 for anything, especially correctness of the displayed data.

The first goal is to reimplement all featuers of the official corona
map and then some convenience features and then maybe some cool
features like historic views.

## Some things to remind myself of what to do
### Development serve
`snowpack dev --reload`

### Build
`snowpack build --config ./snowpack.json`

### Deploy
```
scp -r build/* uberspace:www/corona.t-animal.de
ssh uberspace chmod a+rX -R www/corona.t-animal.de/
```
(Yes, I know.)

