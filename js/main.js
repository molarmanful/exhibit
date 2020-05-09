let env = new Env(board.getContext('2d'), new Player(), [
  new Room(200, 200, '#fff', [new Box(10, 10, 10, 10)])
])

let keys = {}

let loop = _=>{
  env.draw()

  let x = env.player.x
  let y = env.player.y

  if(keys.w) y -= .5
  if(keys.s) y += .5
  if(keys.a) x -= .5
  if(keys.d) x += .5

  if(!env.getRoom().collide(x, y, env.player.width, env.player.height)){
    env.player.x = x
    env.player.y = y
  }

  requestAnimationFrame(loop)
}

onkeydown = e=>{
  keys[e.key] = true
}

onkeyup = e=>{
  keys[e.key] = false
}

board.width = innerWidth
board.height = innerHeight

loop()
