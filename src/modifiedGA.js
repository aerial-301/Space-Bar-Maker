import { buttons, main, stats, buttonsLayer } from "./main.js"

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
    g.canvas.style.transform = "scale(" + scaleToFit + ")"
    const cMargin = (window.innerWidth - g.canvas.width * scaleToFit) / 2
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
        g.render(g.canvas, 0)
      }
    }

    function update() {if (g.state && !g.paused) g.state()}
    g.start = () => {
      if (g.assetFilePaths) {
        g.assets.whenLoaded = function() {
          g.state = undefined
          g.setup()
        };
        g.assets.load(g.assetFilePaths);
        if (g.load) {
          g.state = g.load
        }
      }

      else {
        g.setup()
      }
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
      })
      o.moveHandler = function (e) {
        o._x = (e.pageX - e.target.offsetLeft)
        o._y = (e.pageY - e.target.offsetTop)
        e.preventDefault()
      }
      o.touchmoveHandler = function(event) {
        o._x = (event.targetTouches[0].pageX - g.canvas.offsetLeft);
        o._y = (event.targetTouches[0].pageY - g.canvas.offsetTop);
        event.preventDefault();
      }

      g.canvas.addEventListener("mousemove", o.moveHandler.bind(o), false)
      g.canvas.addEventListener("touchmove", o.touchmoveHandler.bind(o), false)
      g.canvas.style.touchAction = "none"
      return o
    }

    g.wait = (d, c) => setTimeout(c, d)

    g.hitTestPoint = function (p, s) {
      if (p.x < s.gx || p.x > s.gx + s.width || p.y < s.gy || p.y > s.gy + s.height) return false
      return true
    }

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
        var d1 = actx.createOscillator(),
            d2 = actx.createOscillator(),
            d1Volume = actx.createGain(),
            d2Volume = actx.createGain()
  
        d1Volume.gain.value = volumeValue;
        d2Volume.gain.value = volumeValue;
        d1.connect(d1Volume);
        d1Volume.connect(actx.destination);
        d2.connect(d2Volume);
        d2Volume.connect(actx.destination);
        d1.type = "sawtooth";
        d2.type = "sawtooth";
        d1.frequency.value = frequency + diss;
        d2.frequency.value = frequency - diss;
  
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
        var length = actx.sampleRate * duration;
        var impulse = actx.createBuffer(2, length, actx.sampleRate);
        var left = impulse.getChannelData(0),
            right = impulse.getChannelData(1)
        for (var i = 0; i < length; i++){
          var n;
          if (reverse) {
            n = length - i;
          } else {
            n = i;
          }
          left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
          right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }

        return impulse;
      }

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
        c.beginPath()
        c.moveTo(x, y)
        c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height)
        c.fill()
        if (s) c.stroke()
      }
      makeBasicObject(o, x, y, w, h)
      return o
    }

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

      if (text) button.text = g.makeText(button, text, size, '#FFF', textX, textY)  
      buttonsLayer.addChild(button)
      return button
    }

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
      toLoad: 0,
      loaded: 0,
      imageExtensions: ["png", "jpg", "gif", "webp"],
      whenLoaded: undefined,
  
      load: function(sources) {
        var self = this;
        self.toLoad = sources.length;
        sources.forEach(function(source) {
          var extension = source.split('.').pop();
          if (self.imageExtensions.indexOf(extension) !== -1) {
            var image = new Image();
            image.addEventListener("load", function() {
              image.name = source;
              self[image.name] = {
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
            image.src = source;
          }
        });
      },
  
      loadHandler: function() {
        var self = this;
        self.loaded += 1;
        if (self.toLoad === self.loaded) {
          self.toLoad = 0;
          self.loaded = 0;
          self.whenLoaded();
        }
      }
    }
    
    g.sprite = function(source) {
      var o = {}
      makeBasicObject(o)
      o.setTexture = function(source) {
        o.tilesetFrame = g.assets[source]
        o.source = o.tilesetFrame.source
        o.sourceX = o.tilesetFrame.frame.x
        o.sourceY = o.tilesetFrame.frame.y
        o.width = o.tilesetFrame.frame.w
        o.height = o.tilesetFrame.frame.h
        o.sourceWidth = o.tilesetFrame.frame.w
        o.sourceHeight = o.tilesetFrame.frame.h
      }
      o.setTexture(source)
      o.x = 0
      o.y = 0
      g.stage.addChild(o)
      o.render = function(ctx) {
        ctx.drawImage(
          o.source,
          o.sourceX, o.sourceY,
          o.sourceWidth, o.sourceHeight, -o.width * o.pivotX, -o.height * o.pivotY,
          o.width, o.height
        )
      }
      return o
    }

    return g
  }
}



