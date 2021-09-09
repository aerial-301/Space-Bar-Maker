import { buttons, main, stats, buttonsLayer } from "./main.js"
// import { buttons } from "./main/mainSetUp/initBottomPanel.js"

export let GA = {
  create(setup, assetsToLoad) {
    let g = {}
    g.canvas = document.getElementById('c')
    g.canvas.style.backgroundColor = '#555'
    g.canvas.ctx = g.canvas.getContext("2d")
    g.stage = makeStage()
    g.pointer = makePointer()
    g.state = undefined
    g.setup = setup
    g.paused = false
    g._fps = 60
    g._startTime = Date.now()
    g._frameDuration = 1000 / g._fps
    g._lag = 0
    g.interpolate = true

    let scaleToFit = Math.min(
      window.innerWidth / g.canvas.width, 
      window.innerHeight / g.canvas.height
    )
    g.canvas.style.transform = "scale(" + scaleToFit + ")";
    const cMargin = (window.innerWidth - g.canvas.width * scaleToFit) / 2
    // console.log(cMargin)
    g.canvas.style.margin = `0 ${cMargin}px`
    g.scale = scaleToFit


    g.assetFilePaths = assetsToLoad || undefined;

    g.render = (canvas, lagOffset) => {
      let ctx = canvas.ctx
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      g.stage.children.forEach(c => displaySprite(c))
      function displaySprite(s) {

        // if (s.alwaysVisible || s.visible && s.gx < canvas.width + s.width && s.gx + s.width >= -s.width && s.gy < canvas.height + s.height && s.gy + s.height >= -s.height) {
        if (s.alwaysVisible || s.visible) {
          ctx.save()
          // if (g.interpolate) {
            if (s._previousX !== undefined) s.renderX = (s.x - s._previousX) * lagOffset + s._previousX
            else s.renderX = s.x
            if (s._previousY !== undefined) s.renderY = (s.y - s._previousY) * lagOffset + s._previousY
            else s.renderY = s.y
          // } 
          // else {
          // s.renderX = s.x
          // s.renderY = s.y
          // }
          ctx.translate(s.renderX + (s.width * s.pivotX), s.renderY + (s.height * s.pivotY))
          ctx.globalAlpha = s.alpha
          // ctx.rotate(s.rotation)
          // ctx.scale(s.scaleX, s.scaleY)
          // if (s.blendMode)  ctx.globalCompositeOperation = s.blendMode;
          if (s.render) s.render(ctx)
          if (s.children && s.children.length > 0) {
            ctx.translate(-s.width * s.pivotX, -s.height * s.pivotY)
            s.children.forEach(c => displaySprite(c))
          }
          ctx.restore()
        }
      }
    }

    function makeBasicObject(o, x = 0, y = 0, w = 50, h = 50){
      o.x= x
      o.y= y
      o.width= w
      o.height= h
      o.halfWidth= w / 2
      o.halfHeight= h / 2
      o.scaleX= 1
      o.scaleY= 1
      o.pivotX= 0.5
      o.pivotY= 0.5
      o.rotation= 0
      o.alpha= 1
      o.stage= false
      o.visible= true
      o.children = []
      o.parent= undefined
      o.blendMode= undefined
      o.addChild = (c) => {
        if (c.parent) c.parent.removeChild(c)
        c.parent = o
        o.children.push(c)
      }
      o.removeChild = (c) => { if (c.parent === o) o.children.splice(o.children.indexOf(c), 1) }
      Object.defineProperties(o, {
        // _x: { get: () => o.x / g.scale },
        // _y: { get: () => o.y / g.scale },
        gx: { get: () => { return (o.x + (o.parent? o.parent.gx : 0) ) } },
        gy: { get: () => { return (o.y + (o.parent? o.parent.gy : 0) ) } },
        centerX: { get: () => { return o.gx + o.halfWidth } },
        centerY: { get: () => { return o.gy + o.halfHeight } },
        // bottom: { get: () => { return o.y + o.parent.gy} }
      })
    }

    function gameLoop(){
      requestAnimationFrame(gameLoop, g.canvas)

      update()
      if (main.process || main.action || (stats.currentCash != stats.displayedCash)) {
        // console.log(main.process, main.action)
        g.render(g.canvas, 0)
        // g.render(g.canvas, 0)
      }
      // if (!g._fps) {
        // g.render(g.canvas, 0)
      // }
      // else {
        // let current = Date.now(), elapsed = current - g._startTime
        // if (elapsed > 1000) elapsed = g._frameDuration
        // g._startTime = current
        // g._lag += elapsed
        // while (g._lag >= g._frameDuration) {
        //   capturePreviousSpritePositions()
        //   update()
        //   g._lag -= g._frameDuration
        // }

        // if (stats.action || stats.process) {
        //   g.render(g.canvas, g._lag / g._frameDuration)
        //   // g.render(g.canvas, 0)
        // }
      // }
    }
    function capturePreviousSpritePositions(){
      g.stage.children.forEach(s => setPosition(s))
      function setPosition(s) {
        s._previousX = s.x
        s._previousY = s.y
        if (s.children && s.children.length > 0) s.children.forEach(child => setPosition(child))
      }
    }
    function update() {if (g.state && !g.paused) g.state()}
    g.start = () => {

      if (g.assetFilePaths) {

        //Use the supplied file paths to load the assets then run
        //the user-defined `setup` function.
        g.assets.whenLoaded = function() {
  
          //Clear the game `state` function for now to stop the loop.
          g.state = undefined;
  
          //Call the `setup` function that was supplied by the user in
          //Ga's constructor.
          g.setup();
        };
        g.assets.load(g.assetFilePaths);
  
        //While the assets are loading, set the user-defined `load`
        //function as the game state. That will make it run in a loop.
        //You can use the `load` state to create a loading progress bar.
        if (g.load) {
          g.state = g.load;
        }
      }
  
      //If there aren't any assets to load,
      //just run the user-defined `setup` function.
      else {
        g.setup();
      }
      // g.setup()
      gameLoop()
    }
    g.pause = () => g.paused = true
    g.resume = () => g.paused = false
    Object.defineProperties(g, {
      fps: {
        get: () => { return g._fps },
        set: v => {
          g._fps = v
          g._startTime = Date.now()
          g._frameDuration = 1000 / g._fps
        },
      }
    })
    g.remove = (s) => s.parent.removeChild(s)
    

     function makeStage(){
      const o = {}
      makeBasicObject(o, 0, 0, g.canvas.width, g.canvas.height)
      o.stage = true
      return o
    }
    const addC = (c, o) => {
      if (c.parent) c.parent.removeChild(c)
      c.parent = o
      o.children.push(c)
    }
    const remC = (c, o) => c.parent == o ? o.children.splice(o.children.indexOf(c), 1) : 0
    g.group = function (s){
      const o = {}
      makeBasicObject(o)
      o.addChild = (c) => {
          addC(c, o)
          o.calculateSize()
      }
      o.removeChild = (c) => {
          remC(c, o)
          o.calculateSize()
      }
      o.calculateSize = () => {
        if (o.children.length > 0) {
          o._newWidth = 0
          o._newHeight = 0
          o.children.forEach(c => {
            if (c.x + c.width > o._newWidth) o._newWidth = c.x + c.width
            if (c.y + c.height > o._newHeight) o._newHeight = c.y + c.height
          })
          o.width = o._newWidth
          o.height = o._newHeight
        }
      }
      g.stage.addChild(o)
      if (s) {
        var sprites = Array.prototype.slice.call(arguments)
        sprites.forEach(s => o.addChild(s))
      }
      return o
    }

    function makePointer(){
      let o = {}
      o._x = 0
      o._y = 0
      Object.defineProperties(o, {
        x: { get: () => o._x / g.scale },
        y: { get: () => o._y / g.scale },
        gx: { get: () => o.x },
        gy: { get: () => o.y },
        halfWidth: { get: () => 0 },
        halfHeight: { get: () => 0 },
        centerX: { get: () => o.x },
        centerY: { get: () => o.y },
        // shiftedX: {get: () => o.x - world.x},
        // shiftedY: {get: () => o.y - world.y}
      })
      o.moveHandler = function (e) {
        o._x = (e.pageX - e.target.offsetLeft)
        o._y = (e.pageY - e.target.offsetTop)
        e.preventDefault()
      }
      o.touchmoveHandler = function(event) {
        //Find the touch point's x and y position.
        o._x = (event.targetTouches[0].pageX - g.canvas.offsetLeft);
        o._y = (event.targetTouches[0].pageY - g.canvas.offsetTop);
        event.preventDefault();
      }

      g.canvas.addEventListener("mousemove", o.moveHandler.bind(o), false)

      //Touch events.
      // g.canvas.addEventListener("touchstart", o.touchstartHandler.bind(o), false)
      g.canvas.addEventListener("touchmove", o.touchmoveHandler.bind(o), false)

      //Add a `touchend` event to the `window` object as well to
      //catch a mouse button release outside of the canvas area.
      // window.addEventListener("touchend", o.upHandler.bind(o), false)

      //Disable the default pan and zoom actions on the `canvas`.
      g.canvas.style.touchAction = "none"


      return o
    }




    



















    g.wait = (d, c) => setTimeout(c, d)

    g.hitTestRectangle = (r1, r2, global = false) => {
      let hit, vx, vy
      if (global) {
        vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth)
        vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight)
      }
      else {
        vx = r1.centerX - r2.centerX
        vy = r1.centerY - r2.centerY
      }

      if (Math.abs(vx) < r1.halfWidth + r2.halfWidth) {
        if (Math.abs(vy) < r1.halfHeight + r2.halfHeight) {
          hit = true
        }
        else {
          hit = false
        }
      }
      else {
        hit = false
      }
      return hit
    }

    g.hitTestPoint = function (p, s) {
      if (p.x < s.gx || p.x > s.gx + s.width || p.y < s.gy || p.y > s.gy + s.height) return false
      return true
    }

    // g.GlobalDistance = (a, b, aOffX = 0, aOffY = 0) => {return Math.sqrt( ( b.centerX - a.centerX + aOffX)**2 + ( b.centerY - a.centerY + aOffY)**2 )}
    
    g.actx = new AudioContext()
    g.soundEffect = function(frequencyValue, decay, type, volumeValue, pitchBendAmount, reverse, randomValue, diss, attack = 0, reverb = 0) {
      let actx = g.actx
      let oscillator, volume, compressor

      oscillator = actx.createOscillator()
      volume = actx.createGain()
      compressor = actx.createDynamicsCompressor()

      oscillator.connect(volume)
      volume.connect(compressor)
      compressor.connect(actx.destination)


      volume.gain.value = volumeValue;
      oscillator.type = type
      let frequency
      if (randomValue > 0) {
        frequency = g.randomNum(
          frequencyValue - randomValue / 2,
          frequencyValue + randomValue / 2, 1
        )
      } else frequency = frequencyValue
      oscillator.frequency.value = frequency

      fadeIn(volume)
      fadeOut(volume)
      if (pitchBendAmount > 0) pitchBend(oscillator)
      if (reverb) addReverb(volume);
      if (diss) addDissonance()

      play(oscillator)
      oscillator.stop(actx.currentTime + 1);

      function fadeIn(volumeNode) {
        volumeNode.gain.value = 0;
        volumeNode.gain.linearRampToValueAtTime(
          0, actx.currentTime + attack
        );
        volumeNode.gain.linearRampToValueAtTime(
          volumeValue, actx.currentTime + attack
        );
      }

      function fadeOut(volumeNode) {
        volumeNode.gain.linearRampToValueAtTime(volumeValue, actx.currentTime + attack)
        volumeNode.gain.linearRampToValueAtTime(0, actx.currentTime + decay + attack)
      }

      function pitchBend(oscillatorNode) {
        var frequency = oscillatorNode.frequency.value
        if (!reverse) {
          oscillatorNode.frequency.linearRampToValueAtTime(frequency, actx.currentTime)
          oscillatorNode.frequency.linearRampToValueAtTime(frequency - pitchBendAmount, actx.currentTime + decay + attack)
        }

        else {
          oscillatorNode.frequency.linearRampToValueAtTime(frequency, actx.currentTime)
          oscillatorNode.frequency.linearRampToValueAtTime(frequency + pitchBendAmount, actx.currentTime + decay + attack)
        }
      }

      function addDissonance() {
        //Create two more oscillators and gain nodes
        var d1 = actx.createOscillator(),
            d2 = actx.createOscillator(),
            d1Volume = actx.createGain(),
            d2Volume = actx.createGain();
  
        //Set the volume to the `volumeValue`
        d1Volume.gain.value = volumeValue;
        d2Volume.gain.value = volumeValue;
  
        //Connect the oscillators to the gain and destination nodes
        d1.connect(d1Volume);
        d1Volume.connect(actx.destination);
        d2.connect(d2Volume);
        d2Volume.connect(actx.destination);
  
        //Set the waveform to "sawtooth" for a harsh effect
        d1.type = "sawtooth";
        d2.type = "sawtooth";
  
        //Make the two oscillators play at frequencies above and
        //below the main sound's frequency. Use whatever value was
        //supplied by the `dissonance` argument
        d1.frequency.value = frequency + diss;
        d2.frequency.value = frequency - diss;
  
        //Fade in/out, pitch bend and play the oscillators
        //to match the main sound
        if (attack > 0) {
          fadeIn(d1Volume);
          fadeIn(d2Volume);
        }
        if (decay > 0) {
          fadeOut(d1Volume);
          fadeOut(d2Volume);
        }
        if (pitchBendAmount > 0) {
          pitchBend(d1);
          pitchBend(d2);
        }
        if (reverb) {
          addReverb(d1Volume);
          addReverb(d2Volume);
        }
        play(d1);
        play(d2);
      }


      function impulseResponse (duration, decay, reverse, actx) {

        //The length of the buffer.
        var length = actx.sampleRate * duration;
    
        //Create an audio buffer (an empty sound container) to store the reverb effect.
        var impulse = actx.createBuffer(2, length, actx.sampleRate);
    
        //Use `getChannelData` to initialize empty arrays to store sound data for
        //the left and right channels.
        var left = impulse.getChannelData(0),
            right = impulse.getChannelData(1);
    
        //Loop through each sample-frame and fill the channel
        //data with random noise.
        for (var i = 0; i < length; i++){
    
          //Apply the reverse effect, if `reverse` is `true`.
          var n;
          if (reverse) {
            n = length - i;
          } else {
            n = i;
          }
    
          //Fill the left and right channels with random white noise which
          //decays exponentially.
          left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
          right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }
    
        //Return the `impulse`.
        return impulse;
      };



      function addReverb(volumeNode) {
        var convolver = actx.createConvolver();
        convolver.buffer = impulseResponse(reverb[0], reverb[1], reverb[2], actx);
        volumeNode.connect(convolver);
        convolver.connect(compressor);
      }


      function play(node) {
        node.start(actx.currentTime);
      }

    }

    let 
      BP = (c) => c.beginPath(),
      MT = (c, x, y) => c.moveTo(x, y),
      SK = (c) => c.stroke(),
      FL = (c) => c.fill(),
      L = (c, x, y) => c.lineTo(x, y),
      FR = (c, x, y, w, h) => c.fillRect(x, y, w, h)

    // g.circle = (d, k, l, x = 0, y = 0) => {
    //   const o = {
    //     f: k,
    //     radius: d / 2 
    //   }
    //   o.render = (c) => {
    //     c.lineWidth = l
    //     c.fillStyle = o.f
    //     BP(c)
    //     c.arc(o.radius + (-o.radius * 2 * o.pivotX), o.radius + (-o.radius * 2 * o.pivotY), o.radius, 0, 2 * PI, false)
    //     if (l) SK()
    //     FL(c)
    //   }
    //   makeBasicObject(o, x, y, d, d)
    //   return o
    // }

    g.rectangle = (w, h, k = '#FFF', s = 1, x = 0, y = 0) => {
      const o = {
        x: x,
        y: y,
        width: w,
        height: h,
        f: k,
        originalF: k
      }
      o.render = (c) => {
        c.lineWidth = s
        c.fillStyle = o.f
        BP(c)
        MT(c, x, y)
        c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height)
        FL(c)
        if (s) SK(c)
      }
      makeBasicObject(o, x, y, w, h)
      return o
    }

    // function moreProperties(o){
    //   o.target = null
    //   o.attacked = false,
    //   o.isDamaged = false
    //   o.isDead = false
    //   o.damagedAmount = 0
    //   o.HBscale = 0.5
    //   o.yellowHB = g.rectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'Yellow')
    //   o.addChild(o.yellowHB)
    //   o.yellowHB.y = -10
    //   o.HB = g.rectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'green')
    //   o.addChild(o.HB)
    //   o.HB.y = -10
    //   o.HB.visible = false
    //   o.yellowHB.visible = false
    // }

    g.makeText = (parent, content, fontSize, fillStyle, x = 0, y = 0) => {
      const o = {
        content: content,
        font: `small-caps ${fontSize}px sans-serif`,
        fs: fillStyle || '#000',
        textBaseline: "top",
        render(c) {
          c.fillStyle = this.fs
          if (o.width === 0) o.width = c.measureText(o.content).width
          if (o.height === 0) o.height = c.measureText("M").width
          c.translate(-o.width * o.pivotX, -o.height * o.pivotY)
          c.font = o.font
          c.textBaseline = o.textBaseline
          c.fillText(o.content, 0, 0)
        } 
      }
      makeBasicObject(o, x, y, content.length, 20)
      if (parent) parent.addChild(o)
      return o
    }

    g.simpleButton = (
      text,
      x = 0,
      y = 0,
      textX = 10,
      textY = 10,
      action = () => console.log(text),
      size = 14,
      width = 70,
      height = 50,
      color = '#080'
      ) => {

      const button = g.rectangle(width, height, color, 1, x, y)

      button.oColor = color

      if (action) {
        buttons.push(button)
        button.action = action
      }

      if (text) {
        button.text = g.makeText(button, text, size, '#FFF', textX, textY)
      }
        
      // uiElements.push(button)
      buttonsLayer.addChild(button)
      return button
    }
    // g.xDistance = (a, b) => Math.abs(b.centerX - a.centerX)
    // g.yDistance = (a, b) => Math.abs(b.centerY - a.centerY)
    // g.addVectors = (a, b) => {return [a[0] + b[0], a[1] + b[1]]}
    g.removeItem = (array, item) => {
      const index = array.indexOf(item)
      if (index !== -1) array.splice(index, 1)
    }
    g.addNewItem = (array, item) => {
    if (array.findIndex(i => i == item) == -1) array.push(item)
    }
    g.randomNum = (min, max, int = 1) => {
      const r = Math.random() * (max - min) + min
      return int ? r | 0 : r
    }


    g.assets = {

      //Properties to help track the assets being loaded.
      toLoad: 0,
      loaded: 0,
  
      //File extensions for different types of assets.
      imageExtensions: ["png", "jpg", "gif", "webp"],

      //The callback function that should run when all assets have loaded.
      //Assign this when you load the fonts, like this: `assets.whenLoaded = makeSprites;`.
      whenLoaded: undefined,
  
      //The load method creates and loads all the assets. Use it like this:
      //`assets.load(["images/anyImage.png", "fonts/anyFont.otf"]);`.
  
      load: function(sources) {
        console.log("Loading assets...");
  
        //Get a reference to this asset object so we can
        //refer to it in the `forEach` loop ahead.
        var self = this;
  
        //Find the number of files that need to be loaded.
        self.toLoad = sources.length;
        sources.forEach(function(source) {
  
          //Find the file extension of the asset.
          var extension = source.split('.').pop();
  
          //#### Images
          //Load images that have file extensions that match
          //the `imageExtensions` array.
          if (self.imageExtensions.indexOf(extension) !== -1) {
  
            //Create a new image and add a loadHandler
            var image = new Image();
            image.addEventListener("load", function() {
              //Get the image file name.
              image.name = source;
              self[image.name] = {
                //If you just want the file name and the extension, you can
                //get it like this:
                //image.name = source.split("/").pop();
                //Assign the image as a property of the assets object so
                //we can access it like this: `assets["images/imageName.png"]`.
                source: image,
                frame: {
                  x: 0,
                  y: 0,
                  w: image.width,
                  h: image.height
                }
              };
              self.loadHandler();
            }, false);
  
            //Set the image's src property so we can start loading the image.
            image.src = source;
          }
  
          //#### Fonts
          //Load fonts that have file extensions that match the `fontExtensions` array.
          else if (self.fontExtensions.indexOf(extension) !== -1) {
  
            //Use the font's file name as the `fontFamily` name.
            var fontFamily = source.split("/").pop().split(".")[0];
  
            //Append an `@afont-face` style rule to the head of the HTML
            //document. It's kind of a hack, but until HTML5 has a
            //proper font loading API, it will do for now.
            var newStyle = document.createElement('style');
            var fontFace = "@font-face {font-family: '" + fontFamily + "'; src: url('" + source + "');}";
            newStyle.appendChild(document.createTextNode(fontFace));
            document.head.appendChild(newStyle);
  
            //Tell the loadHandler we're loading a font.
            self.loadHandler();
          }
  
          //#### Sounds
          //Load audio files that have file extensions that match
          //the `audioExtensions` array.
          else if (self.audioExtensions.indexOf(extension) !== -1) {
            //Create a sound sprite.
            //
            var soundSprite = g.makeSound(source, self.loadHandler.bind(self));
  
            //Get the sound file name.
            soundSprite.name = source;
  
            //If you just want to extract the file name with the
            //extension, you can do it like this:
            //soundSprite.name = source.split("/").pop();
            //Assign the sound as a property of the assets object so
            //we can access it like this: `assets["sounds/sound.mp3"]`.
            self[soundSprite.name] = soundSprite;
          }
  
          //#### JSON
          //Load JSON files that have file extensions that match
          //the `jsonExtensions` array.
          else if (self.jsonExtensions.indexOf(extension) !== -1) {
  
            //Create a new `xhr` object and an object to store the file.
            var xhr = new XMLHttpRequest();
            var file = {};
  
            //Use xhr to load the JSON file.
            xhr.open("GET", source, true);
            xhr.addEventListener("readystatechange", function() {
  
              //Check to make sure the file has loaded properly.
              if (xhr.status === 200 && xhr.readyState === 4) {
  
                //Convert the JSON data file into an ordinary object.
                file = JSON.parse(xhr.responseText);
  
                //Get the file name.
                file.name = source;
  
                //Assign the file as a property of the assets object so
                //we can access it like this: `assets["file.json"]`.
                self[file.name] = file;
  
                //Texture Packer support.
                //If the file has a `frames` property then its in Texture
                //Packer format.
                if (file.frames) {
  
                  //Create the tileset frames.
                  self.createTilesetFrames(file, source);
                } else {
  
                  //Alert the load handler that the file has loaded.
                  self.loadHandler();
                }
              }
            });
  
            //Send the request to load the file.
            xhr.send();
          }
  
          //Display a message if a file type isn't recognized.
          else {
            console.log("File type not recognized: " + source);
          }
        });
      },
  
      //#### createTilesetFrames
      //`createTilesetFrames` parses the JSON file  texture atlas and loads the frames
      //into this `assets` object.
      createTilesetFrames: function(json, source) {
        var self = this;
  
        //Get the image's file path.
        var baseUrl = source.replace(/[^\/]*$/, '');
        var image = new Image();
        image.addEventListener("load", loadImage, false);
        image.src = baseUrl + json.meta.image;
  
        function loadImage() {
  
          //Assign the image as a property of the `assets` object so
          //we can access it like this:
          //`assets["images/imageName.png"]`.
          self[baseUrl + json.meta.image] = {
            source: image,
            frame: {
              x: 0,
              y: 0,
              w: image.width,
              h: image.height
            }
          };
  
          //Loop through all the frames.
          Object.keys(json.frames).forEach(function(tilesetImage) {
  
            //console.log(json.frames[image].frame);
            //The `frame` object contains all the size and position
            //data.
            //Add the frame to the asset object so that we
            //can access it like this: `assets["frameName.png"]`.
            self[tilesetImage] = json.frames[tilesetImage];
  
            //Get a reference to the source so that it will be easy for
            //us to access it later.
            self[tilesetImage].source = image;
            //console.log(self[tilesetImage].source)
          });
  
          //Alert the load handler that the file has loaded.
          self.loadHandler();
        }
      },
  
      //#### loadHandler
      //The `loadHandler` will be called each time an asset finishes loading.
      loadHandler: function() {
        var self = this;
        self.loaded += 1;
        console.log(self.loaded);
  
        //Check whether everything has loaded.
        if (self.toLoad === self.loaded) {
  
          //If it has, run the callback function that was assigned to the `whenLoaded` property
  
          //Reset `loaded` and `toLoaded` so we can load more assets
          //later if we want to.
          self.toLoad = 0;
          self.loaded = 0;
          self.whenLoaded();
        }
      }
    };
    
    g.sprite = function(source) {
      var o = {};
  
      //If no `source` is provided, alert the user.
      if (source === undefined) throw new Error("Sprites require a source");
  
      //Make this a display object.
      makeBasicObject(o);
      o.frames = [];
      o.loop = true;
      o._currentFrame = 0;
  
      //This next part is complicated. The code has to figure out what
      //the source is referring to, and then assign its properties
      //correctly to the sprite's properties. Read carefully!
      o.setTexture = function(source) {
        //If the source is just an ordinary string, use it to create the
        //sprite.
        if (!source.image) {
          //If the source isn't an array, then it must be a single image.
          if (!(source instanceof Array)) {
            //Is the string referring to a tileset frame from a Texture Packer JSON
            //file, or is it referring to a JavaScript Image object? Let's find out.
  
            //No, it's not an Image object. So it must be a tileset frame
            //from a texture atlas.
  
            //Use the texture atlas's properties to assign the sprite's
            //properties.
            o.tilesetFrame = g.assets[source];
            o.source = o.tilesetFrame.source;
            o.sourceX = o.tilesetFrame.frame.x;
            o.sourceY = o.tilesetFrame.frame.y;
            o.width = o.tilesetFrame.frame.w;
            o.height = o.tilesetFrame.frame.h;
            o.sourceWidth = o.tilesetFrame.frame.w;
            o.sourceHeight = o.tilesetFrame.frame.h;
  
            //The source is an array. But what kind of array? Is it an array
            //Image objects or an array of texture atlas frame ids?
          } else {
            //The source is an array of frames on a texture atlas tileset.
            o.frames = source;
            o.source = g.assets[source[0]].source;
            o.sourceX = g.assets[source[0]].frame.x;
            o.sourceY = g.assets[source[0]].frame.y;
            o.width = g.assets[source[0]].frame.w;
            o.height = g.assets[source[0]].frame.h;
            o.sourceWidth = g.assets[source[0]].frame.w;
            o.sourceHeight = g.assets[source[0]].frame.h;
          }
        }
  
        //If the source contains an `image` sub-property, this must
        //be a `frame` object that's defining the rectangular area of an inner sub-image
        //Use that sub-image to make the sprite. If it doesn't contain a
        //`data` property, then it must be a single frame.
        else if (source.image && !source.data) {
          //Throw an error if the source is not an image file.
          if (!(g.assets[source.image].source instanceof Image)) {
            throw new Error(source.image + " is not an image file");
          }
          o.source = g.assets[source.image].source;
          o.sourceX = source.x;
          o.sourceY = source.y;
          o.width = source.width;
          o.height = source.height;
          o.sourceWidth = source.width;
          o.sourceHeight = source.height;
        }
  
        //If the source contains an `image` sub-property
        //and a `data` property, then it contains multiple frames
        else if (source.image && source.data) {
          o.source = g.assets[source.image].source;
          o.frames = source.data;
  
          //Set the sprite to the first frame
          o.sourceX = o.frames[0][0];
          o.sourceY = o.frames[0][1];
          o.width = source.width;
          o.height = source.height;
          o.sourceWidth = source.width;
          o.sourceHeight = source.height;
        }
      };
  
      //Use `setTexture` to change a sprite's source image
      //while the game is running
      o.setTexture(source);
  
      //Add a `gotoAndStop` method to go to a specific frame.
      o.gotoAndStop = function(frameNumber) {
        if (o.frames.length > 0) {
  
          //If each frame is an array, then the frames were made from an
          //ordinary Image object using the `frames` method.
          if (o.frames[0] instanceof Array) {
            o.sourceX = o.frames[frameNumber][0];
            o.sourceY = o.frames[frameNumber][1];
          }
  
          //If each frame isn't an array, and it has a sub-object called `frame`,
          //then the frame must be a texture atlas id name.
          //In that case, get the source position from the `frame` object.
          else if (g.assets[o.frames[frameNumber]].frame) {
            o.source = g.assets[o.frames[frameNumber]].source;
            o.sourceX = g.assets[o.frames[frameNumber]].frame.x;
            o.sourceY = g.assets[o.frames[frameNumber]].frame.y;
            o.sourceWidth = g.assets[o.frames[frameNumber]].frame.w;
            o.sourceHeight = g.assets[o.frames[frameNumber]].frame.h;
            o.width = g.assets[o.frames[frameNumber]].frame.w;
            o.height = g.assets[o.frames[frameNumber]].frame.h;
          }
  
          //Set the `_currentFrame` value.
          o._currentFrame = frameNumber;
        } else {
          throw new Error("Frame number " + frameNumber + "doesn't exist");
        }
      };
  
      //Set the sprite's getters
      o.x = 0;
      o.y = 0;
  
      //If the sprite has more than one frame, add a state player
      if (o.frames.length > 0) {
        g.addStatePlayer(o);
  
        //Add a getter for the `_currentFrames` property.
        Object.defineProperty(o, "currentFrame", {
          get: function() {
            return o._currentFrame;
          },
          enumerable: false,
          configurable: false
        });
      }
  
      //Add the sprite to the stage
      g.stage.addChild(o);
  
      //A `render` method that describes how to draw the sprite
      o.render = function(ctx) {
        ctx.drawImage(
          o.source,
          o.sourceX, o.sourceY,
          o.sourceWidth, o.sourceHeight, -o.width * o.pivotX, -o.height * o.pivotY,
          o.width, o.height
        );
      };
  
      //Return the sprite
      return o;
    };



    return g
  }
}



