import CephaBannerOne from '@assets/logos/CephaBannerOne.png'
import CephadexLogoSix from '@assets/logos/CephadexLogoSix.png'
import { Dialog, Popover } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@source/common/Buttons/Button'
import { useBannerContext } from '@source/lib/contexts/BannerContext'
import { useModal } from '@source/lib/contexts/ModalContext'
import React, { type ReactElement } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface LinkItemProps {
    url: string
    title: string
}

const LinkItem: React.FC<LinkItemProps> = ({ url, title }) => {
    return (
        <Link
            to={url}
            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:text-blaze-orange"
        >
            {title}
        </Link>
    )
}

const NavBar = (): ReactElement => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { openSignInModal } = useModal()
    const { banner } = useBannerContext()

    const insert = banner != null ? 'inset-y-10' : 'inset-y-0'
    return (
        <header className="relative z-40 bg-white">
            <nav
                className={`mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 ${
                    mobileMenuOpen ? 'hidden' : 'visible'
                }`}
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link to="/#">
                        <span className="sr-only">Cephadex</span>
                        <img
                            className="h-10 w-auto"
                            src={CephaBannerOne}
                            alt=""
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="z-11 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen)
                        }}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="size-6" aria-hidden="true" />
                    </button>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <LinkItem url="/pricing" title="Pricing" />
                    <LinkItem url="/documentation" title="Documentation" />
                    <LinkItem url="/blog" title="Blog" />
                </Popover.Group>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Button
                        onClick={() => {
                            openSignInModal('login')
                        }}
                        label="Log in"
                    />
                </div>
            </nav>
            <Dialog
                as="div"
                className="z-40 lg:hidden"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
            >
                <div className="fixed inset-0 z-40" />
                <Dialog.Panel
                    className={`fixed ${insert} right-0 z-40 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10`}
                >
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Cephadex</span>
                            <img
                                className="h-8 w-auto"
                                src={CephadexLogoSix}
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md  p-2.5 text-gray-700"
                            onClick={() => {
                                setMobileMenuOpen(!mobileMenuOpen)
                            }}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="size-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <LinkItem url="/pricing" title="Pricing" />
                                <LinkItem
                                    url="/documentation"
                                    title="Documentation"
                                />
                                <LinkItem url="/blog" title="Blog" />
                            </div>
                            <div className="py-6">
                                <button
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-black hover:text-blaze-orange"
                                    onClick={() => {
                                        openSignInModal('login')
                                    }}
                                >
                                    Log in
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* <div className="absolute left-5 top-5 z-50">
        <img
          src={CephaLogoOne}
          className="h-10 cursor-pointer"
          alt="Cepha Banner"
          onClick={() => {
            navigate(`/`);
          }}
        />
      </div> */}
        </header>
    )
}

export { NavBar }
