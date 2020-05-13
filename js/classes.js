class Env {

  constructor(ctx, player, rooms, npcs = [], scale = 3){
    this.ctx = ctx
    this.room = 0
    player.adopt(this)
    this.player = player
    rooms.forEach(a=> a.adopt(this))
    this.rooms = rooms
    this.scale = scale

    player.spawn()
  }

  clear(){
    board.width = this.getRoom().width * this.scale
    board.height = this.getRoom().height * this.scale
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.scale(this.scale, this.scale)
  }

  draw(){
    this.clear()
    this.getRoom().draw()
  }

  getRoom(){
    return this.rooms[this.room]
  }
}


class Player {

  constructor(width=5, height=15, src='./media/playersprites.png'){
    this.sprites = new Image()
    this.sprites.src = src
    this.x = 0
    this.y = 0
    this.width = width
    this.height = height
    this.frame = 0
    this.time = 0
    this.flipped = false
  }

  adopt(env){
    this.env = env
    this.ctx = this.env.ctx
  }

  spawn(){
    this.x = this.env.getRoom().width / 2 - this.width / 2 | 0
    this.y = this.env.getRoom().height / 2 - this.height / 2 | 0
  }

  draw(){
    this.ctx.imageSmoothingEnabled = false
    this.ctx.drawImage(
      this.sprites,
      this.frame * this.width, this.flipped * this.height,
      this.width, this.height,
      this.x | 0, this.y | 0,
      this.width, this.height
    )
  }

  step(){
    if(!(this.time % 5)){
      this.frame++
      this.frame %= this.sprites.width / this.width
    }

    this.time++
  }

  move(keys){

    let x = this.x
    let y = this.y

    if(keys.w || keys.s || keys.a || keys.d || keys[' ']){
      if(keys.w) y -= .2
      if(keys.s) y += .2
      if(keys.a) x -= .2, this.flipped = true
      if(keys.d) x += .2, this.flipped = false

      let collide = this.env.getRoom().collide(x, y + 13, 5, 2)
      let icollide = this.env.getRoom().collide(x - 1, y + 12, 7, 4)
      if(keys[' '] && icollide && icollide.interact){
        icollide.interact()
      }

      if(!collide){
        this.x = x
        this.y = y
        if(!keys[' ']) this.step()
      }
      else {
        this.frame = 0
      }
    }
    else {
      this.frame = 0
      this.time = 0
    }
  }

  collide(x, y, width, height){
    if(
      x + width > this.x && x < this.x + this.width &&
      y + height > this.y + 13 && y < this.y + 15
    ) return this
  }
}


class NPC {

  constructor(name, src, x, y, width=5, height=15, collider, flipped=false){
    this.name = name
    this.sprites = new Image()
    this.sprites.src = src
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.collider = collider || {x: 0, y: this.height - 2, width: this.width, height: 2}
    this.oflipped = flipped
    this.flipped = flipped

    this.frame = 0
    this.time = Math.random() * 360 | 0
    this.time1 = 0
    this.dist = 0
    this.dir = ''
  }

  adopt(room, id){
    this.room = room
    this.env = this.room.env
    this.id = id
    this.ctx = this.env.ctx
  }

  draw(){
    this.ctx.imageSmoothingEnabled = false
    this.ctx.drawImage(
      this.sprites,
      this.frame * this.width, this.flipped * this.height,
      this.width, this.height,
      this.x | 0, this.y | 0,
      this.width, this.height
    )
  }

  step(){
    if(!(this.time1 % 5)){
      this.frame++
      this.frame %= this.sprites.width / this.width
    }

    this.time1++
  }

  move(){
    this.time++

    if(this.time > 360){
      this.time = 0
      this.dist = Math.random() * 10 | 0
      this.dir = 'wsad'[Math.random() * 4 | 0]
    }

    if(this.dist > 0){
      let x = this.x
      let y = this.y

      if(this.dir == 'w') y -= .2
      if(this.dir == 's') y += .2
      if(this.dir == 'a') x -= .2, this.flipped = !this.oflipped
      if(this.dir == 'd') x += .2, this.flipped = this.oflipped

      this.dist -= .2

      if(!this.env.getRoom().collide(x + this.collider.x - 1, y + this.collider.y, this.collider.width + 2, this.collider.height, this.id)){
        this.x = x
        this.y = y
        this.step()
      }
      else {
        this.frame = 0
      }
    }
    else {
      this.frame = 0
      this.time1 = 0
    }
  }

  collide(x, y, width, height, npci){
    if(
      this.id != npci &&
      x + width > this.x + this.collider.x && x < this.x + this.collider.x + this.collider.width &&
      y + height > this.y + this.collider.y && y < this.y + this.collider.y + this.collider.height
    ) return this
  }

  interact(){
    if(document.getElementById(this.name)){
      document.getElementById(this.name).style.display = 'inline-block'
    }
  }
}

class Static {

  constructor(name, src, x, y, width, height, collider, anim=false){
    this.name = name
    this.sprites = new Image()
    this.sprites.src = src
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.collider = collider || {x: 0, y: this.height - 2, width: this.width, height: 2}
    this.anim = anim

    this.time = Math.random() * 540 | 0
    this.time1 = 0
    this.dist = 0
    this.frame = 0
  }

  adopt(room, id){
    this.room = room
    this.env = this.room.env
    this.id = id
    this.ctx = this.env.ctx
  }

  draw(){
    this.ctx.imageSmoothingEnabled = false
    this.ctx.drawImage(
      this.sprites,
      this.frame * this.width, 0,
      this.width, this.height,
      this.x | 0, this.y | 0,
      this.width, this.height
    )
  }

  step(){
    if(!(this.time1 % 5)){
      this.frame++
      this.dist--
    }

    this.time1++
  }

  move(){
    if(this.anim){
      this.time++

      if(this.time > 540){
        this.time = 0
        this.dist = this.sprites.width / this.width
      }

      if(this.dist > 1){
        this.step()
      }
      else {
        this.frame = 0
        this.time1 = 0
      }
    }
  }

  collide(x, y, width, height){
    if(
      x + width > this.x + this.collider.x && x < this.x + this.collider.x + this.collider.width &&
      y + height > this.y + this.collider.y && y < this.y + this.collider.y + this.collider.height
    ) return this
  }

  interact(){
    if(document.getElementById(this.name)){
      document.getElementById(this.name).style.display = 'inline-block'
    }
  }
}


class Room {

  constructor(width, height, contents=[], npcs=[], sprite='./media/checkersprite.png', wall){
    this.width = width
    this.height = height
    this.sprite = new Image()
    this.sprite.src = sprite
    this.contents = contents
    this.npcs = npcs
    this.wall = wall || {
      height: 20,
      color: '#fefefe',
      bColor: '#f5f5f5'
    }
  }

  adopt(env){
    this.env = env
    this.ctx = this.env.ctx
    this.contents.forEach(a=> a.adopt(this))
    this.npcs.forEach((a, i)=> a.adopt(this, i))
  }

  draw(player){
    this.ctx.imageSmoothingEnabled = false
    Array.from(new Array(this.width / this.sprite.width), (_, x)=>{
      Array.from(new Array(this.height / this.sprite.height), (_, y)=>{
        this.ctx.drawImage(this.sprite, x * this.sprite.width, y * this.sprite.height)
      })
    })

    this.ctx.fillStyle = this.wall.color
    this.ctx.fillRect(0, 0, this.width, this.wall.height)
    this.ctx.fillStyle = this.wall.bColor
    this.ctx.fillRect(0, this.wall.height * 3 / 4, this.width, this.wall.height / 4)

    let cs = [this.env.player, ...this.contents, ...this.npcs].sort((a, b)=> a.y + a.height - b.y - b.height)
    cs.map(a=> a.draw())
  }

  moveContents(){
    this.contents.forEach(a=>{
      a.move()
    })
  }

  moveNPCs(){
    this.npcs.forEach(a=>{
      a.move()
    })
  }

  collide(x, y, width, height, npci){
    if(
      x < 0 || x + width > this.width ||
      y < 0 || y + height > this.height
    ) return this
    return [...this.contents, ...this.npcs]
      .concat(!isNaN(npci) ? this.env.player : [])
      .find(a=> a.collide(x, y, width, height, npci))
  }
}


class Box {

  constructor(x, y, width, height, color='#00f'){
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }

  adopt(room){
    this.room = room
    this.env = this.room.env
    this.ctx = this.env.ctx
  }

  draw(){
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x | 0, this.y | 0, this.width, this.height)
  }

  collide(x, y, width, height){
    if(
      x + width > this.x && x < this.x + this.width &&
      y + height > this.y && y < this.y + this.height
    ) return this
  }

  move(){}
}
