import { FaArrowLeft, FaArrowRight, FaBars, FaBookmark, FaCheck, FaClockRotateLeft, FaCompass, FaDownload, FaGear, FaHeart, FaHouse, FaLayerGroup, FaMagnifyingGlass, FaPlay, FaStar } from 'react-icons/fa6'

const icons = {
  home: FaHouse,
  discover: FaCompass,
  collections: FaLayerGroup,
  watchlist: FaHeart,
  search: FaMagnifyingGlass,
  play: FaPlay,
  star: FaStar,
  bookmark: FaBookmark,
  history: FaClockRotateLeft,
  download: FaDownload,
  settings: FaGear,
  back: FaArrowLeft,
  previous: FaArrowLeft,
  next: FaArrowRight,
  menu: FaBars,
  check: FaCheck,
}

export default function Icon({ name, size = 14 }) {
  const IconComponent = icons[name]
  return IconComponent ? <IconComponent className="icon" size={size} aria-hidden="true" /> : null
}
