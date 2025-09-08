import React from "react";
import "./LicenseInfo.scss";

interface LicenseInfoProps {
  onBack: () => void;
}

const LicenseInfo: React.FC<LicenseInfoProps> = ({ onBack }) => {
  const lpcCredits = `
[ アバター1 ]
body/bodies/male/amber.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases; 'Thick' Male Revised Run/Climb by JaidynReiman (based on ElizaWy's LPC Revised)
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- JaidynReiman
		- Benjamin K. Smith (BenCreating)
		- Evert
		- Eliza Wyatt (ElizaWy)
		- TheraHedwig
		- MuffinElZangano
		- Durrani
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://opengameart.org/content/lpc-be-seated
		- https://opengameart.org/content/lpc-runcycle-for-male-muscular-and-pregnant-character-bases-with-modular-heads
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-character-bases

head/heads/human/male/amber.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-character-bases

eyes/eyebrows/thick/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

hair/spiked_porcupine/adult/dark_brown.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
	- Authors:
		- Fabzy
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/the-revolution-hair
		- https://opengameart.org/content/lpc-hair

facial/glasses/glasses/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Head%20Accessories
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

neck/necklace/simple/male/silver.png
	- Note: 
	- Licenses:
		- CC0
	- Authors:
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-jewelry

torso/clothes/shortsleeve/shortsleeve_polo/male/black.png
	- Note: original by ElizaWy; spellcast/thrust/shoot/hurt/male adapted from original by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
		- JaidynReiman
		- Stephen Challener (Redshrike)
		- Johannes Sjölund (wulax)
	- Links:
		- http://opengameart.org/content/lpc-revised-character-basics
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more
		- https://opengameart.org/content/lpc-expanded-simple-shirts

legs/pants2/male/red.png
	- Note: original overalls by ElizaWy, base animations adapted from v3 overalls by bluecarrot16, pants by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- ElizaWy
		- Bluecarrot16
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more
		- https://opengameart.org/content/lpc-expanded-pants

----------------------------------------------------
[ アバター2 ]
body/bodies/male/light.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases; 'Thick' Male Revised Run/Climb by JaidynReiman (based on ElizaWy's LPC Revised)
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- JaidynReiman
		- Benjamin K. Smith (BenCreating)
		- Evert
		- Eliza Wyatt (ElizaWy)
		- TheraHedwig
		- MuffinElZangano
		- Durrani
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://opengameart.org/content/lpc-be-seated
		- https://opengameart.org/content/lpc-runcycle-for-male-muscular-and-pregnant-character-bases-with-modular-heads
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-character-bases

head/heads/human/male/light.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-character-bases

eyes/eyebrows/thick/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

hair/page2/adult/black.png
	- Note: Original by Johannes Sjölund (wulax). Edited, animated, and recolored by ElizaWy.
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- ElizaWy
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

torso/clothes/longsleeve/longsleeve/male/white.png
	- Note: original by wulax, recolors and cleanup by JaidynReiman, further recolors by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- http://opengameart.org/content/lpc-clothing-updates

torso/jacket/collared/male/charcoal.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-gentleman
		- https://opengameart.org/content/lpc-pirates

legs/pants/male/blue.png
	- Note: original male pants by wulax, recolors and edits to v3 base by bluecarrot16, climb/jump/run/sit/emotes/revised combat by JaidynReiman based on ElizaWy's LPC Revised
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
		- CC-BY-SA 3.0
	- Authors:
		- bluecarrot16
		- JaidynReiman
		- ElizaWy
		- Matthew Krohn (makrohn)
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-expanded-pants

feet/shoes/sara/male/leather.png
	- Note: LPC Sara by Redshrike, contributed by William Thompsonj, Shoes Separated by Bluecarrot16, Male Version and Jump/Sit/Emote/Run/Revised Combat by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- CC-BY 3.0+
		- GPL 2.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Bluecarrot16
		- Mandi Paugh
		- Stephen Challener (Redshrike)
		- William.Thompsonj
	- Links:
		- http://opengameart.org/content/sara-wizard
		- https://opengameart.org/content/lpc-sara
		- https://opengameart.org/content/lpc-expanded-socks-shoes

----------------------------------------------------
[ アバター3 ]
body/bodies/male/light.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases; 'Thick' Male Revised Run/Climb by JaidynReiman (based on ElizaWy's LPC Revised)
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- JaidynReiman
		- Benjamin K. Smith (BenCreating)
		- Evert
		- Eliza Wyatt (ElizaWy)
		- TheraHedwig
		- MuffinElZangano
		- Durrani
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://opengameart.org/content/lpc-be-seated
		- https://opengameart.org/content/lpc-runcycle-for-male-muscular-and-pregnant-character-bases-with-modular-heads
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-character-bases

head/heads/human/male/light.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-character-bases

hair/plain/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Manuel Riecke (MrBeast)
		- Joe White
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/ponytail-and-plain-hairstyles
		- https://opengameart.org/content/lpc-expanded-hair

facial/glasses/round/adult/black.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Thane Brimhall (pennomi)
		- laetissima
	- Links:
		- https://opengameart.org/content/clothing-facial-features-and-ui-elements
		- https://opengameart.org/content/lpc-gentleman

torso/clothes/longsleeve/longsleeve/male/black.png
	- Note: original by wulax, recolors and cleanup by JaidynReiman, further recolors by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- http://opengameart.org/content/lpc-clothing-updates

torso/jacket/trench/male/dark_gray.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-gentleman

legs/pants2/male/black.png
	- Note: original overalls by ElizaWy, base animations adapted from v3 overalls by bluecarrot16, pants by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- ElizaWy
		- Bluecarrot16
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more
		- https://opengameart.org/content/lpc-expanded-pants

feet/shoes/revised/male/brown.png
	- Note: original overalls and shoes by ElizaWy, base animations adapted from v3 overalls by bluecarrot16, shoes by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- ElizaWy
		- Bluecarrot16
		- Stephen Challener (Redshrike)
		- Johannes Sjölund (wulax)
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-socks-shoes

----------------------------------------------------
[ アバター4 ]
body/bodies/female/light.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- Benjamin K. Smith (BenCreating)
		- bluecarrot16
		- TheraHedwig
		- Evert
		- MuffinElZangano
		- Durrani
		- Pierre Vigier (pvigier)
		- ElizaWy
		- Matthew Krohn (makrohn)
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-ladies
		- https://opengameart.org/content/lpc-7-womens-shirts
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-be-seated
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://gitlab.com/vagabondgame/lpc-characters
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle

head/heads/human/female/light.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/
		- https://opengameart.org/content/lpc-character-bases

hair/bob/adult/dark_brown.png
	- Note: Original by bluecarrot16. Edited and animated by ElizaWy.
	- Licenses:
		- CC0
	- Authors:
		- ElizaWy
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-hair
		- https://github.com/ElizaWy/LPC/blob/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

torso/clothes/blouse_longsleeve/female/tan.png
	- Note: original princess.xcf by Sharm, edited to blouse by ElizaWy; blouse + longsleeve adapted to v3 bases by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- ElizaWy
		- Lanea Zimmerman (Sharm)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-7-womens-shirts

torso/aprons/overalls/female/brown.png
	- Note: original overalls by ElizaWy, extended to all animation frames, adapted from teen to male base, and edited for v3 bases by bluecarrot16; extended to combat animations by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
	- Authors:
		- ElizaWy
		- bluecarrot16
		- JaidynReiman
	- Links:
		- https://opengameart.org/content/lpc-revised-character-basics
		- http://opengameart.org/content/lpc-clothing-updates

legs/skirts/plain/female/tan.png
	- Note: original by wulax, edited for female base by pvigier, edited for v3 base by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Pierre Vigier (pvigier)
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites

feet/shoes/basic/thin/brown.png
	- Note: original by wulax, edited for female base by Joe White, edited for v3 base by bluecarrot16, Jump/Sit/Emote/Run/Revised Combat by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Joe White
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- http://opengameart.org/content/lpc-clothing-updates
		- https://opengameart.org/content/lpc-expanded-socks-shoes

----------------------------------------------------
[ アバター5 ]
body/bodies/female/light.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- Benjamin K. Smith (BenCreating)
		- bluecarrot16
		- TheraHedwig
		- Evert
		- MuffinElZangano
		- Durrani
		- Pierre Vigier (pvigier)
		- ElizaWy
		- Matthew Krohn (makrohn)
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-ladies
		- https://opengameart.org/content/lpc-7-womens-shirts
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-be-seated
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://gitlab.com/vagabondgame/lpc-characters
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle

head/heads/human/male/light.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-character-bases

eyes/eyebrows/thin/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

hair/bangs_bun/adult/black.png
	- Note: Original by bluecarrot16, animated by ElizaWy.
	- Licenses:
		- CC0
	- Authors:
		- ElizaWy
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-hair
		- https://github.com/ElizaWy/LPC/blob/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

neck/necklace/beaded_small/female/iron.png
	- Note: 
	- Licenses:
		- CC0
	- Authors:
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-jewelry

torso/clothes/blouse_longsleeve/female/black.png
	- Note: original princess.xcf by Sharm, edited to blouse by ElizaWy; blouse + longsleeve adapted to v3 bases by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- ElizaWy
		- Lanea Zimmerman (Sharm)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-7-womens-shirts

legs/pantaloons/thin/charcoal.png
	- Note: Original bases by Redshrike, thrust/shoot bases by Wulax, Original Pantaloons by Nila122, Female/Teen version by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 2.0
		- GPL 3.0
	- Authors:
		- Nila122
		- JaidynReiman
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/lpc-pirates
		- https://opengameart.org/content/more-lpc-clothes-and-hair
		- https://opengameart.org/content/lpc-expanded-pants

feet/boots/basic/thin/black.png
	- Note: original by Nila122, edited for v3 bases by bluecarrot16, Jump/Sit/Emote/Run/Revised Combat by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 2.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- bluecarrot16
		- Nila122
	- Links:
		- https://opengameart.org/content/lpc-clothes-and-hair
		- https://opengameart.org/content/lpc-expanded-socks-shoes

----------------------------------------------------
[ アバター6 ]
 body/bodies/female/light.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- Benjamin K. Smith (BenCreating)
		- bluecarrot16
		- TheraHedwig
		- Evert
		- MuffinElZangano
		- Durrani
		- Pierre Vigier (pvigier)
		- ElizaWy
		- Matthew Krohn (makrohn)
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-ladies
		- https://opengameart.org/content/lpc-7-womens-shirts
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-be-seated
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://gitlab.com/vagabondgame/lpc-characters
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle

head/heads/human/male/light.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-character-bases

eyes/eyebrows/thin/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

hair/long_center_part/adult/fg/black.png
	- Note: 
	- Licenses:
		- CC0
	- Authors:
		- thecilekli
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-long-straight-hair-with-12-colors
		- https://opengameart.org/content/lpc-hair

hair/long_center_part/adult/bg/black.png
	- Note: 
	- Licenses:
		- CC0
	- Authors:
		- thecilekli
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-long-straight-hair-with-12-colors
		- https://opengameart.org/content/lpc-hair

facial/glasses/round/adult/base.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Thane Brimhall (pennomi)
		- laetissima
	- Links:
		- https://opengameart.org/content/clothing-facial-features-and-ui-elements
		- https://opengameart.org/content/lpc-gentleman

torso/clothes/longsleeve/longsleeve2_cardigan/female/maroon.png
	- Note: original by ElizaWy; spellcast/thrust/shoot/hurt/male adapted from original by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
		- JaidynReiman
		- Stephen Challener (Redshrike)
		- Johannes Sjölund (wulax)
	- Links:
		- http://opengameart.org/content/lpc-revised-character-basics
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

legs/skirts/straight/female/tan.png
	- Note: original skirt by ElizaWy, extended to all animation frames and edited for v3 bases by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- ElizaWy
	- Links:
		- http://opengameart.org/content/lpc-clothing-updates

feet/shoes/basic/thin/white.png
	- Note: original by wulax, edited for female base by Joe White, edited for v3 base by bluecarrot16, Jump/Sit/Emote/Run/Revised Combat by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Joe White
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- http://opengameart.org/content/lpc-clothing-updates
		- https://opengameart.org/content/lpc-expanded-socks-shoes

----------------------------------------------------
[ Botアバター ]
body/bodies/teen/light.png
	- Note: see details at https://opengameart.org/content/lpc-character-bases; 'Thick' Male Revised Run/Climb by JaidynReiman (based on ElizaWy's LPC Revised)
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Evert
		- TheraHedwig
		- Benjamin K. Smith (BenCreating)
		- MuffinElZangano
		- Durrani
		- Pierre Vigier (pvigier)
		- Eliza Wyatt (ElizaWy)
		- Matthew Krohn (makrohn)
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
		- https://opengameart.org/content/lpc-ladies
		- https://opengameart.org/content/lpc-teen-unisex-base-clothes
		- https://opengameart.org/content/lpc-jump-expanded
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://opengameart.org/content/lpc-be-seated
		- https://gitlab.com/vagabondgame/lpc-characters
		- https://opengameart.org/content/lpc-male-jumping-animation-by-durrani
		- https://opengameart.org/content/lpc-jump-expanded

head/heads/human/male/light.png
	- Note: original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Benjamin K. Smith (BenCreating)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/lpc-character-bases

eyes/human/adult/undefined/brown.png
	- Note: original by Redshrike, mapped to all frames by Matthew Krohn & JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Matthew Krohn (makrohn)
		- Stephen Challener (Redshrike)
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles

eyes/eyebrows/thick/adult/black.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Hair
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more

hair/plain/adult/gray.png
	- Note: 
	- Licenses:
		- OGA-BY 3.0
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- JaidynReiman
		- Manuel Riecke (MrBeast)
		- Joe White
	- Links:
		- https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles
		- https://opengameart.org/content/ponytail-and-plain-hairstyles
		- https://opengameart.org/content/lpc-expanded-hair

hat/formal/tophat/adult/base.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
	- Links:
		- https://opengameart.org/content/lpc-gentleman
		- https://opengameart.org/content/lpc-expanded-hats-facial-helmets

facial/glasses/round/adult/sunglasses.png
	- Note: 
	- Licenses:
		- CC-BY-SA 3.0
		- GPL 3.0
	- Authors:
		- bluecarrot16
		- Thane Brimhall (pennomi)
		- laetissima
	- Links:
		- https://opengameart.org/content/clothing-facial-features-and-ui-elements
		- https://opengameart.org/content/lpc-gentleman

torso/clothes/shortsleeve/tshirt/teen/white.png
	- Note: original by ElizaWy; spellcast/thrust/shoot/hurt/male adapted from original by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
		- JaidynReiman
		- Stephen Challener (Redshrike)
		- Johannes Sjölund (wulax)
	- Links:
		- https://opengameart.org/content/lpc-revised-character-basics
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more
		- https://opengameart.org/content/lpc-expanded-simple-shirts

torso/aprons/overalls/teen/blue.png
	- Note: original overalls by ElizaWy, extended to all animation frames, adapted from teen to male base, and edited for v3 bases by bluecarrot16; extended to combat animations by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
		- GPL 3.0
	- Authors:
		- ElizaWy
		- bluecarrot16
		- JaidynReiman
	- Links:
		- https://opengameart.org/content/lpc-revised-character-basics
		- http://opengameart.org/content/lpc-clothing-updates

legs/pants2/thin/blue.png
	- Note: Original bases by Redshrike, thrust/shoot bases by Wulax, original pants by ElizaWy, climb/jump/run/sit/emotes/revised combat by JaidynReiman
	- Licenses:
		- OGA-BY 3.0
	- Authors:
		- ElizaWy
		- JaidynReiman
		- Johannes Sjölund (wulax)
		- Stephen Challener (Redshrike)
	- Links:
		- https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing
		- https://opengameart.org/content/lpc-expanded-sit-run-jump-more
		- https://opengameart.org/content/lpc-expanded-pants
  `;

  return (
    <div className="license-info-container">
      <div className="license-info-header">
        <button onClick={onBack} className="license-back-button">
          ← 戻る
        </button>
        <h2 className="license-info-title">ライセンス情報</h2>
      </div>
      <div className="license-info-content">
        <div className="license-section">
          <h3>アセットの利用について</h3>
          <p>
            このアプリケーションでは、以下のオープンソースアセットを利用しています。素晴らしい作品を提供してくださったクリエイターの皆様に感謝いたします。
          </p>
        </div>

        <div className="license-section">
          <h4>2D空間タイルデザイン</h4>
          <p>
            - "tileset_office.png" by nkorth, hosted on OpenGameArt.org is
            licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by/3.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 3.0
            </a>
            .
            <br />
            Source:{" "}
            <a
              href="https://opengameart.org/content/netslash-tiles"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://opengameart.org/content/netslash-tiles
            </a>
          </p>
          <p>
            - "city_extension.png", "offie-space-tileset.png",
            "office-tilemap.png" are licensed under{" "}
            <a
              href="http://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC0 1.0
            </a>
            .
          </p>
        </div>

        <div className="license-section">
          <h4>アバター</h4>
          <p>
            アバターは「Universal LPC Sprite Sheet Character
            Generator」を使用して作成されました。
          </p>
          <p className="license-notice warning">
            <strong>
              【重要】アバターの一部にはGPL
              3.0ライセンスのパーツが含まれています。GPLライセンスの素材をアプリケーションに組み込む場合、アプリケーション全体のソースコードをGPL
              3.0ライセンスの下で公開する義務が生じる可能性があります。
            </strong>
          </p>
          <p className="license-notice">
            <strong>
              CC-BY-SA 4.0ライセンスのパーツが含まれるアバターは、それ自体が{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY-SA 4.0
              </a>{" "}
              ライセンスの下で提供されます。
            </strong>
          </p>
          <h5>クレジット (使用パーツ)</h5>
          <pre className="credits-box">{lpcCredits.trim()}</pre>
        </div>
      </div>
    </div>
  );
};

export default LicenseInfo;
