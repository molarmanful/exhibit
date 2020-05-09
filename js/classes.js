class Env {
  constructor(ctx, player, rooms){
    this.ctx = ctx
    this.room = 0

    player.adopt(this)
    this.player = player
    rooms.forEach(a=> a.adopt(this))
    this.rooms = rooms

    player.spawn()
  }

  clear(){
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  draw(){
    this.clear()
    this.rooms[this.room].draw()
    this.player.draw()
  }

  getRoom(){
    return this.rooms[this.room]
  }
}

class Player {
  constructor(color='#f00'){
    this.color = color
    this.x = 0
    this.y = 0
    this.width = 4
    this.height = 8
  }

  adopt(env){
    this.env = env
    this.ctx = this.env.ctx
  }

  spawn(){
    this.x = this.env.getRoom().width / 2 - this.width / 2
    this.y = this.env.getRoom().height / 2 - this.height / 2
  }

  clamp(){
  }

  draw(){
    this.ctx.fillStyle = this.color
    let cw = this.ctx.canvas.width
    let ch = this.ctx.canvas.height
    let rw = this.env.getRoom().width
    let rh = this.env.getRoom().height
    this.ctx.fillRect(cw / 2 - rw / 2 + this.x | 0, ch / 2 - rh / 2 + this.y | 0, this.width, this.height)
  }
}

class Room {
  constructor(width, height, color='#fff', contents=[]){
    this.width = width
    this.height = height
    this.color = color
    this.contents = contents
  }

  adopt(env){
    this.env = env
    this.ctx = this.env.ctx
    this.contents.forEach(a=> a.adopt(this))
  }

  draw(){
    this.ctx.fillStyle = this.color
    let cw = this.ctx.canvas.width
    let ch = this.ctx.canvas.height
    this.ctx.fillRect(cw / 2 - this.width / 2 | 0, ch / 2 - this.height / 2 | 0, this.width, this.height)
    this.contents.map(a=> a.draw())
  }

  collide(x, y, width, height){
    if(
      x < 0 || x + width > this.width ||
      y < 0 || y + height > this.height ||
      this.contents.some(a=> a.collide(x, y, width, height))
    ) return true
    return false
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
    let cw = this.ctx.canvas.width
    let ch = this.ctx.canvas.height
    let rw = this.room.width
    let rh = this.room.height
    this.ctx.fillRect(cw / 2 - rw / 2 + this.x | 0, ch / 2 - rh / 2 + this.y | 0, this.width, this.height)
  }

  collide(x, y, width, height){
    if(
      x + width > this.x && x < this.x + this.width &&
      y + height > this.y && y < this.y + this.height
    ) return true
    return false
  }
}
