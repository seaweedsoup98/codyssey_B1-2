export default function EmptyState({ message, action }) {
  return (
    <div className="state-box">
      <strong>표시할 데이터가 없습니다.</strong>
      <p>{message}</p>
      {action}
    </div>
  )
}
