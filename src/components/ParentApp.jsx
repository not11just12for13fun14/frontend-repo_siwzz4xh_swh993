import { useEffect, useState } from 'react'
import { Header, Button, Input, Textarea, Card, Modal, TabBar, Empty } from './ui'
import { Home, MessageSquare, Images, MoreHorizontal, QrCode, Bell, Calendar, Pill, Camera } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function useFetch(url, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!url) return
    setLoading(true)
    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, deps)
  return { data, loading }
}

export default function ParentApp() {
  const [tab, setTab] = useState('home')
  const [login, setLogin] = useState({ email: '', code: '' })
  const [loggedIn, setLoggedIn] = useState(true)

  const { data: notifications } = useFetch(`${API}/notifications?limit=10`, [loggedIn])
  const { data: album } = useFetch(`${API}/album?limit=12`, [loggedIn])

  const [qrOpen, setQrOpen] = useState(false)

  const HomeTab = () => (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-sky-50 to-emerald-50">
        <div className="text-slate-700">Today's Log</div>
        <div className="text-sm text-slate-500">Meals, activities, notes at a glance</div>
        <Button className="mt-3" onClick={() => setTab('more')} variant="secondary">View</Button>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => setTab('messages')}>
          <div className="flex items-center gap-2 text-slate-700"><MessageSquare size={18}/> Messages</div>
          <div className="text-xs text-slate-500 mt-1">Chat with teachers</div>
        </Card>
        <Card onClick={() => setQrOpen(true)}>
          <div className="flex items-center gap-2 text-slate-700"><QrCode size={18}/> Pick-Up QR</div>
          <div className="text-xs text-slate-500 mt-1">Scan at school gate</div>
        </Card>
        <Card onClick={() => setTab('album')}>
          <div className="flex items-center gap-2 text-slate-700"><Images size={18}/> Album</div>
          <div className="text-xs text-slate-500 mt-1">Photos & videos</div>
        </Card>
        <Card onClick={() => setTab('notifications')}>
          <div className="flex items-center gap-2 text-slate-700"><Bell size={18}/> Notifications</div>
          <div className="text-xs text-slate-500 mt-1">Pick-up and notices</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => setTab('leave')}>
          <div className="flex items-center gap-2 text-slate-700"><Calendar size={18}/> Leave Request</div>
          <div className="text-xs text-slate-500 mt-1">Submit a date & reason</div>
        </Card>
        <Card onClick={() => setTab('medicine')}>
          <div className="flex items-center gap-2 text-slate-700"><Pill size={18}/> Medicine</div>
          <div className="text-xs text-slate-500 mt-1">Provide dosage & photo</div>
        </Card>
      </div>
    </div>
  )

  const MessagesTab = () => {
    const [text, setText] = useState('')
    const { data: msgs, loading } = useFetch(`${API}/messages?limit=20`, [tab])
    const send = async () => {
      await fetch(`${API}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender_role: 'parent', text }) })
      setText('')
    }
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-3">
          {msgs?.length ? msgs.map((m, i) => (
            <Card key={i} className={`${m.sender_role==='parent'?'bg-sky-50':'bg-white'}`}>{m.text || 'Image'}</Card>
          )) : <Empty title="No messages" subtitle="Start a conversation" />}
        </div>
        <div className="mt-3 flex gap-2">
          <Input placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} className="flex-1" />
          <Button onClick={send}>Send</Button>
        </div>
      </div>
    )
  }

  const LeaveTab = () => {
    const [date, setDate] = useState('')
    const [reason, setReason] = useState('')
    const [sent, setSent] = useState(false)
    const submit = async () => {
      await fetch(`${API}/leave-requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, reason }) })
      setSent(true)
    }
    return sent ? <Card className="text-emerald-700 bg-emerald-50">Leave request sent</Card> : (
      <div className="space-y-3">
        <Input label="Date" placeholder="YYYY-MM-DD" value={date} onChange={e=>setDate(e.target.value)} />
        <Textarea label="Reason" value={reason} onChange={e=>setReason(e.target.value)} />
        <Button onClick={submit} className="w-full">Submit</Button>
      </div>
    )
  }

  const MedicineTab = () => {
    const [drug, setDrug] = useState('')
    const [dosage, setDosage] = useState('')
    const [notes, setNotes] = useState('')
    const [sent, setSent] = useState(false)
    const submit = async () => {
      await fetch(`${API}/medicine-requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drug_name: drug, dosage, notes }) })
      setSent(true)
    }
    return sent ? <Card className="text-emerald-700 bg-emerald-50">Medicine request submitted</Card> : (
      <div className="space-y-3">
        <Input label="Drug name" value={drug} onChange={e=>setDrug(e.target.value)} />
        <Input label="Dosage" value={dosage} onChange={e=>setDosage(e.target.value)} />
        <Textarea label="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
        <Button onClick={submit} className="w-full">Submit</Button>
      </div>
    )
  }

  const AlbumTab = () => (
    <div className="grid grid-cols-3 gap-2">
      {album?.length ? album.map((a, i) => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
          <img src={a.media_url || `https://picsum.photos/seed/${i}/300/300`} alt="" className="w-full h-full object-cover" />
        </div>
      )) : <Empty title="No photos yet" />}
    </div>
  )

  const NotificationsTab = () => (
    <div className="space-y-3">
      {notifications?.length ? notifications.map((n, i) => (
        <Card key={i}>
          <div className="text-slate-800 font-medium">{n.title}</div>
          <div className="text-sm text-slate-500">{n.body}</div>
        </Card>
      )) : <Empty title="No notifications" />}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50">
      <Header title="Wheremykidsat (家長端)" right={<Button variant="secondary" onClick={()=>setQrOpen(true)}><QrCode size={16}/> QR</Button>} />
      <div className="max-w-md mx-auto p-4 pb-24">
        {tab === 'home' && <HomeTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'album' && <AlbumTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'leave' && <LeaveTab />}
        {tab === 'medicine' && <MedicineTab />}
      </div>

      <TabBar
        tabs={[
          { key: 'home', label: 'Home', icon: Home },
          { key: 'messages', label: 'Messages', icon: MessageSquare },
          { key: 'album', label: 'Album', icon: Images },
          { key: 'notifications', label: 'More', icon: MoreHorizontal },
        ]}
        active={tab}
        onChange={setTab}
      />

      <Modal open={qrOpen} onClose={()=>setQrOpen(false)} title="Pick-Up QR">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WHEREMYKIDSAT`} alt="QR" className="rounded" />
          </div>
          <div className="text-sm text-slate-500">Increase screen brightness for easier scanning</div>
        </div>
      </Modal>
    </div>
  )
}
