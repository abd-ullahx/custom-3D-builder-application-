import { useSmoothScroll } from './useSmoothScroll'

const SmoothScroll = ({ children }) => {
  useSmoothScroll()

  return <>{children}</>
}

export default SmoothScroll
