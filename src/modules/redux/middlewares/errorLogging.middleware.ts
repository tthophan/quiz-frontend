import { notificationController } from '@/controllers/notification.controller'
import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'

/**
 * Log a warning and show a toast!
 */
export const errorLoggingMiddleware: Middleware = () => next => action => {
    if (isRejectedWithValue(action)) {
        notificationController.error({ message: String(action.payload) })
    }

    return next(action)
}
