# ImageCutter

ImageCutter er en react app med c# backend. Applikasjonen tar en eller flere bilder og lar brukeren gjøre et utsnitt, som utføres på alle filene. De endrede filene returneres som en .zip

### NB! 
Knappen "Process Images" returnerer en .zip. For innsikt i hva som ligger i denne se metoden CutterController.submit() i Controllers/CutterController.cs

## Viktige filer i ImageCutterAPI (C#)
### ImageCutter.cs
Inneholder statiske metoder for å kutte ut ett rektangel fra en image-objekt, og utføre denne handlingen over en fil-samling
### Selection.cs
Modellerer utsnittet fra frontenden og endrer det til en rektangel
### Controllers/CutterController.cs
Håndterer en HttpPost-request mellom front og backend og returnerer de ferdigstilte filene.

## Viktige filer i imagecutter-app (React)
### src/fileSelect.js
En liten komponent som tar imot filene brukeren vil kutte.
### src/App.js
Håndterer alt relatert til <canvas>, sender HttpPost til backend, og øvride frontend-opgaver

## pkmnsample
En liten samling png-filer av gamle pokemonkort. Disse kan være nyttige til å teste applikasjonen siden de har uniform layout
