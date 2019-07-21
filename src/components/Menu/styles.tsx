import emotion from 'react-emotion'
import { animated } from 'react-spring'

export const Container = emotion('div')({
  position: 'fixed',
  left: '15px',
  top: '15px',
  zIndex: 10000
})

export const MenuIcon = emotion('img')({
  width: '35px',
  height: '35px',
  margin: '0 7px'
})

export const Button = emotion('div')({
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  marginLeft: '10px',
  fontSize: '30px',
  opacity: 0.9,
  color: '#FFF',
  '&:hover': {
    opacity: 1
  }
})

export const ContentMenu = emotion('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',
  height: '100%',
  top: 0,
  left: 0
})

export const MenuContainer = emotion(animated.div)({
  height: '50px',
  position: 'absolute',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
  background: '#3b3a3a',
  overflow: 'hidden',
  borderRadius: '35px'
})
