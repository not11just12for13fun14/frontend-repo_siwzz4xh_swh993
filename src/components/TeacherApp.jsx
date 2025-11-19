import { useEffect, useState } from 'react'
import { Header, Button, Input, Textarea, Card, Modal, TabBar, Empty } from './ui'
import { Home, MessageSquare, Images, MoreHorizontal, QrCode, Check, X } from 'lucide-react'

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

export default function TeacherApp() {
  const [tab, setTab] = useState('home')
  const { data: leaves, loading: leavesLoading } = useFetch(`${API}/leave-requests?status=pending`, [tab])
  const { data: meds } = useFetch(`${API}/medicine-requests?status=pending`, [tab])

  const approveLeave = async (id, status) => {
    await fetch(`${API}/leave-requests/${id}/${status}`, { method: 'POST' })
  }

  const confirmMed = async (id) => {
    await fetch(`${API}/medicine-requests/${id}/confirm`, { method: 'POST' })
  }

  const HomeTab = () => (
    <div className="space-y-4">
      <Card>
        <div className="font-medium text-slate-700 mb-2">Pending Medicine Requests</div>
        {meds?.length ? meds.map((m,i)=>(
          <div key={i} className="p-3 border rounded-xl mb-2">
            <div className="text-slate-700">{m.drug_name} - {m.dosage}</div>
            <div className="text-xs text-slate-500 mb-2">{m.notes}</div>
            <Button onClick={()=>confirmMed(m._id)} className="w-full">Confirm Given</Button>
          </div>
        )) : <Empty title="No pending medicine" />}
      </Card>
      <Card>
        <div className="font-medium text-slate-700 mb-2">Pending Leave Requests</div>
        {leaves?.length ? leaves.map((l,i)=>(
          <div key={i} className="p-3 border rounded-xl mb-2">
            <div className="text-slate-700">{l.date}</div>
            <div className="text-xs text-slate-500 mb-2">{l.reason}</div>
            <div className="flex gap-2">
              <Button className="flex-1" variant="secondary" onClick={()=>approveLeave(l._id,'approve')}><Check size={16}/> Approve</Button>
              <Button className="flex-1" variant="danger" onClick={()=>approveLeave(l._id,'reject')}><X size={16}/> Reject</Button>
            </div>
          </div>
        )) : <Empty title="No pending leave" />}
      </Card>
    </div>
  )

  const MessagesTab = () => {
    const [text, setText] = useState('')
    const { data: msgs } = useFetch(`${API}/messages?limit=20`, [tab])
    const send = async () => {
      await fetch(`${API}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender_role: 'teacher', text }) })
      setText('')
    }
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-3">
          {msgs?.length ? msgs.map((m, i) => (
            <Card key={i} className={`${m.sender_role==='teacher'?'bg-emerald-50':'bg-white'}`}>{m.text || 'Image'}</Card>
          )) : <Empty title="No messages" subtitle="Start a conversation" />}
        </div>
        <div className="mt-3 flex gap-2">
          <Input placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} className="flex-1" />
          <Button onClick={send}>Send</Button>
        </div>
      </div>
    )
  }

  const AlbumTab = () => {
    const [url, setUrl] = useState('')
    const [caption, setCaption] = useState('')
    const submit = async () => {
      await fetch(`${API}/album`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ media_url: url, caption }) })
      setUrl(''); setCaption('')
    }
    return (
      <div className="space-y-3">
        <Input label="Photo URL" value={url} onChange={e=>setUrl(e.target.value)} />
        <Input label="Caption" value={caption} onChange={e=>setCaption(e.target.value)} />
        <Button onClick={submit} className="w-full">Upload</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50">
      <Header title="Wheremykidsat (教師端)" right={<Button variant="secondary"><QrCode size={16}/> Scan</Button>} />
      <div className="max-w-md mx-auto p-4 pb-24">
        {tab === 'home' && <HomeTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'album' && <AlbumTab />}
        {tab === 'notifications' && <Empty title="More coming soon" />}
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
    </div>
  )
}
