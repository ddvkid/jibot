import { subscribe } from './subscription';

export const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

export const handleMessage = async (body) => {
  const [_, action, type, name] = body.message.text.split(' ');
  if (action && action.toLowerCase() === "subscribe") {
    return await subscribe(type, body);
  }
  return {
    text: 'handleMessage ' + JSON.stringify(body.message)
  }
}

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  }
}