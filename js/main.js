let env = new Env(board.getContext('2d'), new Player(), [
  new Room(200, 200, [
    new Box(0, 0, 200, 20, 'rgba(0, 0, 0, 0)'),
  ], [
    new NPC('mori', './media/morisprites.png', 10, 40, 8, 15, null, true),
    new NPC('zhanghuan', './media/zhanghuansprites.png', 180, 50, 5, 15),
    new NPC('336', './media/336sprites.png', 95, 170, 5, 15),
    new NPC('leewen', './media/leewensprites.png', 50, 130, 5, 15),
    new NPC('gericault', './media/gericaultsprites.png', 120, 40, 5, 15),
    new Static('about', './media/qsprite.png', 97, 70, 5, 10),
    new Static('buddha', './media/buddhasprite.png', 97, 12, 7, 12),
    new Static('chinternet', './media/pandasprite.png', 150, 150, 7, 10),
    new Static('aiweiwei', './media/jarsprites.png', 180, 170, 8, 15, null, true),
    new Static('harsono', './media/harsonosprites.png', 60, 100, 7, 15, null, true)
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
  if(keys['Escape']){
    document.querySelectorAll('.win').forEach(a=>{
      a.style.display = 'none'
    })
  }
}

onkeyup = e=>{
  keys[e.key] = false
}

document.querySelectorAll('.close').forEach(a=>{
  a.onclick = e=>{
    document.getElementById(e.target.getAttribute('name')).style.display = 'none'
  }
})

onload = loop
