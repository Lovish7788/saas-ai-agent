// Authentication Layout (Server Component)
// This layout wraps all authentication pages (sign-in, sign-up, forgot-password) and provides centering/styling.
import React from "react"

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div>
            {/* Centered layout wrapper with full-screen height and muted background */}
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                {/* Visual placeholder width guide for inner content alignment */}
                <div className="w-full max-w-sm md:max-w-3xl"></div>
                {children}
            </div>
        </div>
    )
}

export default Layout