const DrawnCardModal= ({ card, onAccept, onDeny }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-64">
        <div>
          <div>Drawn Card</div>
        </div>
        <div>
          <div className="text-center text-4xl">
            {card.rank}
            {card.suit}
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onAccept}>Accept</button>
          <button onClick={onDeny} variant="outline">
            Deny
          </button>
        </div>
      </div>
    </div>
  )
}

export default DrawnCardModal

