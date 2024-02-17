'use client'

import storage from '../storage'

const APP_SIDE_BAR_IS_OPENED = 'app:sidebar:is-opened'

export const readIsSidebarOpen = async (): Promise<boolean> => {
    const sidebarOpened = await storage.getItem(APP_SIDE_BAR_IS_OPENED)
    return Boolean(sidebarOpened)
}

export const persistIsSidebarOpen = async (value: boolean): Promise<void> => {
    storage.setItem(APP_SIDE_BAR_IS_OPENED, `${value}`)
}
