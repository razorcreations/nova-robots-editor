import Tool from './components/Tool'

Nova.booting((app, store) => {
  Nova.inertia('NovaRobotsEditor', Tool)
})
