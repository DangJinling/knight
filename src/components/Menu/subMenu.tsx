import React, { useContext, useState, FC } from 'react'
import classNames from 'classnames'
import { MenuContext } from './menu'
import { MenuItemProps } from './menuItem'
import Icon from '../Icon/icon'
import Transition from '../Transition/transition'

export interface SubmenuProps {
  /** 子菜单的索引 */
  index?: string;
  /** 子菜单的标题 */
  title: string;
  className?: string;
}

export const Submenu: FC<SubmenuProps> = ({
  index,
  title,
  children,
  className
}) => {
  const context = useContext(MenuContext)
  const openedSubmenus = context.defaultOpenSubmenus as Array<string>
  const isOpened = (index && context.mode === 'vertical')
    ? openedSubmenus.includes(index)
    : false
  const [menuOpen, setOpen] = useState(isOpened)

  const classes = classNames('menu-item submenu-item', {
   'is-active': context.index === index,
   'is-opened': menuOpen,
   'is-vertical': context.mode === 'vertical'
  })

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(!menuOpen)
  }

  let timer: any
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
      setOpen(toggle)
    }, 300)
  }

  const cliclEvents = context.mode === 'vertical' ? {
      onClick: handleClick
    } : {}

  const hoverEvents = context.mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
    onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false) }
  } : []

  const renderChildren = () => {
    const subMenuClasses = classNames('knight-submenu', {
      'menu-opened': menuOpen
    })

    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>

      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`
        })
      } else {
        console.error('Warning: Submenu has a child which is not a MenuItem component')
      }
    })

    return (
      <Transition
        in={menuOpen}
        timeout={300}
        animation="zoom-in-top"
      >
        <ul className={subMenuClasses}>
          {childrenComponent}
        </ul>
      </Transition>
    )
  }

  return (
    <li key={index} className={classes} {...hoverEvents}>
       <div className="submenu-title" {...cliclEvents}>
         {title}
         <Icon icon="angle-down" className="arrow-icon" />
       </div>
       {renderChildren()}
    </li>
  )
}

Submenu.displayName = 'Submenu'

export default Submenu
