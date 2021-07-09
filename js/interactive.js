console.log("%c Coffeee Cream: " , "background: springgreen;color: black; border-radius: 5px;padding: 2px;", "Thanks for coming to my website!" )
//set css for full screen canvas
ORBS.setFullScreenGameCss()
//initiate a new renderer
var renderer = new ORBS.renderer({renderState: update, bgColor: "#fdc18a", fps: 40, width: window.innerWidth, height: window.innerHeight})
//create a new scene
var scene = new ORBS.scene()
//new script component
var bounce = new ORBS.scriptComponent(function(self,im,ot) {
    if (self.y > ot.screen.height - 50) {
        self.yMove = -5*ot.delta
    }
    if (self.y < 50) {
        self.yMove = 5*ot.delta
    }
    if (self.x > ot.screen.width - 50) {
        self.xMove = -5*ot.delta
    }
    if (self.x < 50) {
        self.xMove = 5*ot.delta
    }
    self.dx = self.xMove
    self.dy = self.yMove
    return self
})
var rbounce = new ORBS.scriptComponent(function(self,im,ot) {
	if (self.y > ot.screen.height - 50) {
	    self.yMove = -15*ot.delta
	}
	if (self.y < 50) {
	    self.yMove = 15*ot.delta
	}
	if (self.x > ot.screen.width - 50) {
	    self.xMove = -15*ot.delta
	}
	if (self.x < 50) {
	    self.xMove = 15*ot.delta
	}
	self.dx = self.xMove
	self.dy = self.yMove
	return self
    })

var linescript = new ORBS.scriptComponent()
linescript.attachScript(function(self, imp, ot) {
    self.start = Vect(imp[0].x, imp[0].y)
    self.end = Vect(imp[1].x, imp[1].y)
})
var lineObj = new ORBS.obj({type: lineRndr, name: "line"})
linescript.imports(function() {return [window.scene.getObj("rect"), window.scene.getObj("rect2")]})
lineObj.attachScript(linescript)
lineObj.drawFunc({width: 5, color: "darkorchid"})
scene.add(lineObj)

var linescript2 = new ORBS.scriptComponent()
linescript2.attachScript(function(self, imp, ot) {
    self.start = Vect(window.innerWidth/2, -10)
    self.end = Vect(imp[0].x, imp[0].y)
})
var lineObj2 = new ORBS.obj({type: lineRndr, name: "line"})
linescript2.imports(function() {return [window.scene.getObj("rect")]})
lineObj2.attachScript(linescript2)
lineObj2.drawFunc({width: 5, color: "darkslateblue"})
scene.add(lineObj2)

var circles = new ORBS.obj({type: mesh, drawType: circle, name: "circle"})
circles.drawFunc({x: window.innerWidth-100, y: window.innerHeight/20, width: 50, color: "springgreen"})
circles.attachScript(bounce)
circles.setVars("yMove", 1.3)
circles.setVars("xMove", -1.3)
scene.add(circles)

var circles2 = new ORBS.obj({type: mesh, drawType: circle, name: "circle2"})
circles2.drawFunc({x: window.innerWidth/20, y: window.innerHeight-100, width: 50, color: "cornflowerblue"})
circles2.attachScript(bounce)
circles2.setVars("yMove", 1.3)
circles2.setVars("xMove", -1.3)
scene.add(circles2)

var rects = new ORBS.obj({type: mesh, drawType: rect, name: "rect"})
rects.drawFunc({x: window.innerWidth/20, y: window.innerHeight/3, width: 100, height: 100, color: "crimson"})
rects.attachScript(rbounce)
rects.setVars("yMove", 6)
rects.setVars("xMove", 6)
scene.add(rects)

var rects2 = new ORBS.obj({type: mesh, drawType: rect, name: "rect2"})
rects2.drawFunc({x: (window.innerWidth/10)*9, y: window.innerHeight-100, width: 100, height: 100, color: "orange"})
rects2.attachScript(rbounce)
rects2.setVars("yMove", -6)
rects2.setVars("xMove", -6)
scene.add(rects2)

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.canvasAttactToDom(document.getElementById("back"), "prepend")
renderer.startRenderCycle()
renderer.setScene(scene)

window.onresize = () => renderer.setSize(window.innerWidth, window.innerHeight)

setInterval(() => {
	let circl = new ORBS.obj({type: mesh, drawType: circle, name: "circle"})
	let rgb = `rgb(${(Math.random() * 255) + 1},${(Math.random() * 255) + 1},${(Math.random() * 255) + 1}`
	circl.drawFunc({x: window.innerWidth-Math.floor((Math.random() * window.innerWidth) + 1), y: window.innerHeight-Math.floor((Math.random() * window.innerHeight) + 1), width: 50, color: rgb})
	circl.attachScript(bounce)
	circl.setVars("yMove", (Math.random() * 2.0) + -2.0)
	circl.setVars("xMove", (Math.random() * 2.0) + -2.0)
	if (scene.vScene.length > 13) {} else {
		scene.add(circl)
	}
},1000)