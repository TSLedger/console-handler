query Cards {
  cards {
    id
    name
    set {
      id
      name
    }
    localId
    variants {
      holo
      normal
      reverse
    }
    image
  }
}
