"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RotateCcw, Printer } from "lucide-react"

interface AppHeaderProps {
    onReset: () => void;
}

export function AppHeader({ onReset }: AppHeaderProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-background/80 backdrop-blur-sm border-b no-print">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-4 ml-auto">
        <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="mr-2 size-4" />
            Reset
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-2 size-4" />
          Print Report
        </Button>
      </div>
    </header>
  )
}
