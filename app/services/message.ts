export const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

export const handleMessage = (body) => {
  return {
    text: 'handleMessage ' + JSON.stringify(body.message.sender)
  }
}

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  }
}