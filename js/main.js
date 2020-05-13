let env = new Env(board.getContext('2d'), new Player(), [
  new Room(200, 200, [
    new Box(0, 0, 200, 20, 'rgba(0, 0, 0, 0)'),
  ], [
    new NPC('./media/morisprites.png', 10, 40, 8, 15, null, true),
    new NPC('./media/zhanghuansprites.png', 180, 50, 5, 15),
    new NPC('./media/336sprites.png', 95, 170, 5, 15),
    new NPC('./media/leewensprites.png', 50, 130, 5, 15),
    new NPC('./media/gericaultsprites.png', 120, 40, 5, 15),
    new Static('./media/buddhasprite.png', 97, 12, 7, 12),
    new Static('./media/pandasprite.png', 150, 150, 7, 10),
    new Static('./media/jarsprites.png', 180, 170, 8, 15, null, true)
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
