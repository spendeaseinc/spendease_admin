/* eslint-disable prettier/prettier */
export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
    <div>
        <h1>Notification Detail</h1>
        <p>Notification ID: {id}</p>
        </div>
    </div>
  )
}