'use client'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { FaBars, FaCog, FaPowerOff } from 'react-icons/fa'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar'
import { FaBell } from 'react-icons/fa6'

const Navigation = () => {
  const { userInfo } = useUserInfoStore((state) => state)
  const [menu, setMenu] = React.useState<any>(userInfo.menu)

  const handleLogout = () => {
    useUserInfoStore.getState().logout()
  }

  React.useEffect(() => {
    const label = document.querySelector(`[data-drawer-target="bars"]`)
    if (userInfo.id) {
      setMenu(userInfo.menu)
      label?.classList.remove('hidden')
    } else {
      label?.classList.add('hidden')
    }
  }, [userInfo])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const auth = (
    <>
      <div className='hidden lg:block flex-row'>
        <ul className='px-1 flex space-x-4 items-center'>
          <Link href='/notifications'>
            <FaBell />
          </Link>
          {menu.map((item: any, i: number) => (
            <Fragment key={i}>
              {!item?.children && <Link href={item.path}>{item.name}</Link>}

              {item?.children && (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className='outline-none'>
                    {capitalizeFirstLetter(item.name)}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='hidden lg:block'>
                    {item.children.map((child: any, i: number) => (
                      <DropdownMenuItem key={i}>
                        <Link href={child.path} className='justify-between'>
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Fragment>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <Avatar>
                <AvatarImage
                  src={
                    userInfo.image ||
                    `https://ui-avatars.com/api/?uppercase=true&name=${userInfo?.name}`
                  }
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='hidden lg:block'>
              <DropdownMenuItem className='flex items-center gap-x-2'>
                <Avatar>
                  <AvatarImage
                    src={
                      userInfo.image ||
                      `https://ui-avatars.com/api/?uppercase=true&name=${userInfo?.name}`
                    }
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className='grid grid-cols-1 text-gray-500'>
                  <h6 className='font-bold'>{userInfo.name}</h6>
                  <span className='font-light'>{userInfo.email}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link
                  href='/account/profile'
                  className='items-center flex gap-2 text-gray-500'
                >
                  <FaCog />
                  <span>Manage account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => handleLogout()}>
                  <Link
                    href='/auth/login'
                    className='flex items-center flex-row gap-2 text-gray-500'
                  >
                    <FaPowerOff /> <span>Sign out</span>
                  </Link>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
      </div>

      <div className='lg:hidden'>
        <Menubar className='border-none lg:hidden'>
          <MenubarMenu>
            <MenubarTrigger>
              <FaBars className='text-gray-500 text-2xl' />
            </MenubarTrigger>
            <MenubarContent className='lg:hidden'>
              <ul>
                <MenubarItem>
                  <Link href='/account/profile' className='justify-between'>
                    Profile
                  </Link>
                </MenubarItem>
                <MenubarItem>
                  <Link
                    href='/notifications'
                    className='flex flex-row items-center justify-between'
                  >
                    <FaBell /> Notifications
                  </Link>
                </MenubarItem>
                {menu.map((item: any, i: number) => (
                  <Fragment key={i}>
                    {!item?.children && (
                      <MenubarItem>
                        <Link href={item.path}>{item.name}</Link>
                      </MenubarItem>
                    )}

                    {item?.children && (
                      <MenubarSub key={item.name}>
                        <MenubarSubTrigger className='px-2 py-1.5 text-sm flex flex-row items-center outline-none'>
                          {capitalizeFirstLetter(item.name)}
                        </MenubarSubTrigger>
                        <MenubarPortal>
                          <MenubarSubContent className='bg-white p-1 rounded-md border border-gray-200 w-auto z-50 lg:hidden'>
                            {item.children.map((child: any, i: number) => (
                              <MenubarItem key={i}>
                                <Link
                                  href={child.path}
                                  className='justify-between'
                                >
                                  {child.name}
                                </Link>
                              </MenubarItem>
                            ))}
                          </MenubarSubContent>
                        </MenubarPortal>
                      </MenubarSub>
                    )}
                  </Fragment>
                ))}

                <MenubarSeparator />
                <MenubarItem>
                  <li>
                    <button onClick={() => handleLogout()}>
                      <Link
                        href='/auth/login'
                        className='flex justify-start items-center flex-row gap-x-1 text-red-500'
                      >
                        <FaPowerOff /> <span>Logout</span>
                      </Link>
                    </button>
                  </li>
                </MenubarItem>
              </ul>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </>
  )

  return (
    <div className='flex-none'>
      <ul className='px-1 w-full'>
        {!userInfo.id && (
          <li>
            <Link href='/auth/login'>Login</Link>
          </li>
        )}
      </ul>
      {userInfo.id && auth}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
