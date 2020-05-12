let env = new Env(board.getContext('2d'), new Player(), [
  new Room(200, 200, [new Box(0, 0, 200, 20, 'rgba(0, 0, 0, 0)')], [
    new NPC('./media/morisprites.png', 10, 40, 8, 15, null, true),
    new NPC('./media/zhanghuansprites.png', 180, 50, 5, 15)
  ]
)])

let keys = {}

let loop = _=>{
  env.player.move(keys)
  env.getRoom().moveNPCs()
  env.draw()

  requestAnimationFrame(loop)
}

onkeydown = e=>{
  keys[e.key] = true
}

onkeyup = e=>{
  keys[e.key] = false
}

onload = loop
