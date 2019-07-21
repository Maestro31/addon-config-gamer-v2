import * as React from 'react'
import { Keyframes } from 'react-spring'
import { faDownload, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import delay from 'delay'
import chrome from '../../services/Browser'
import * as S from './styles'

const MenuBar: any = Keyframes.Spring({
  open: { x: 150 },
  close: async call => {
    await delay(400)
    await call({ x: 50 })
  }
})

interface Props {
  onSaveCart: () => void
  onSettingsClick: () => void
}

interface State {
  open: boolean
}

export default class Menu extends React.Component<Props, State> {
  state = {
    open: false
  }

  openMenu = (e: React.MouseEvent): void => {
    this.setState({ open: true })
  }

  closeMenu = (e: React.MouseEvent): void => {
    this.setState({ open: false })
  }

  render() {
    const state = this.state.open ? 'open' : 'close'
    return (
      <S.Container onMouseOver={this.openMenu} onMouseLeave={this.closeMenu}>
        <MenuBar native state={state}>
          {({ x }) => (
            <S.MenuContainer
              style={{
                width: x.interpolate(x => `${x}px`)
              }}>
              <S.ContentMenu>
                <S.MenuIcon src={chrome.runtime.getURL('/img/icon48.png')} />
                <S.Button onClick={this.props.onSaveCart}>
                  <FontAwesomeIcon icon={faDownload} />
                </S.Button>
                <S.Button onClick={this.props.onSettingsClick}>
                  <FontAwesomeIcon icon={faCog} />
                </S.Button>
              </S.ContentMenu>
            </S.MenuContainer>
          )}
        </MenuBar>
      </S.Container>
    )
  }
}
