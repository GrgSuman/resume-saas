"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { flushSync } from "react-dom"
import { toast } from "react-toastify"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Download,
  ArrowDownUp,
  SlidersHorizontal,
} from "lucide-react"

// UI Components
import { Button } from "../../../../components/ui/button"
import { Switch } from "../../../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet"

// Local Components & Hooks
import ManageSections from "./ManageSections"
import { useResume } from "../../../../hooks/useResume"
import { TEMPLATES, FONT_FAMILIES } from "../../types/constants"
import axiosInstance from "../../../../api/axios"

interface SettingsNewProps {
  htmlRef: React.RefObject<HTMLDivElement | null>
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

const SettingsNew = ({ htmlRef, zoomLevel, onZoomIn, onZoomOut, onResetZoom }: SettingsNewProps) => {
  const { state, dispatch } = useResume()
  const navigate = useNavigate()
  const editMode = state.resumeEditingMode ?? false

  // Mobile Sheet State
  const [isManageSectionsOpen, setIsManageSectionsOpen] = useState(false)
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false)

  // Resume Settings Data
  const selectedTemplate = state.resumeSettings?.template || "professional"
  const fontFamily = state.resumeSettings?.fontFamily || "Lato"
  const lineHeight = Number.parseFloat(state.resumeSettings?.lineHeight ?? "1.4")
  const resumeName = state.resumeTitle || "Resume"

  // --- Handlers ---
  const handleTemplateChange = (value: string) => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { template: value } })
  }
  const handleFontFamilyChange = (value: string) => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { fontFamily: value } })
  }
  const handleLineHeightIncrease = () => {
    const newLineHeight = Math.min(Number((lineHeight + 0.1).toFixed(2)), 2.0)
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { lineHeight: String(newLineHeight) } })
  }
  const handleLineHeightDecrease = () => {
    const newLineHeight = Math.max(Number((lineHeight - 0.1).toFixed(2)), 1.0)
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { lineHeight: String(newLineHeight) } })
  }

  const handleExport = async () => {
    const previousEditMode = state.resumeEditingMode ?? false
    flushSync(() => {
      dispatch({ type: "SET_EDITING_MODE", payload: false })
    })
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

    if (htmlRef.current) {
      const htmlContent = htmlRef.current.innerHTML
      try {
        dispatch({ type: "SET_DOWNLOADING", payload: true })
        const response = await axiosInstance.post(
          "/generate-pdf",
          { htmlContent, marginStatus: true, resumeName: resumeName },
          { responseType: "blob" },
        )
        const blob = new Blob([response.data], { type: "application/pdf" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${resumeName}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
        toast.error("Failed to download PDF")
      } finally {
        flushSync(() => {
          dispatch({ type: "SET_EDITING_MODE", payload: previousEditMode })
        })
        dispatch({ type: "SET_DOWNLOADING", payload: false })
      }
    }
  }

  const renderDesignControls = () => (
    <div className="space-y-6 px-2">
      {/* Template Section */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-foreground block">Template</label>
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-full h-10 bg-muted/40 border-muted hover:bg-muted/60 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Typography Section */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-foreground block">Typography</label>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Font Family</p>
            <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
              <SelectTrigger className="w-full h-10 bg-muted/40 border-muted hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Line Height</p>
            <div className="flex items-center gap-2 border border-muted bg-muted/40 rounded-lg p-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/80 transition-colors"
                onClick={handleLineHeightDecrease}
                disabled={lineHeight <= 1.0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold w-12 text-center tabular-nums">{lineHeight.toFixed(1)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/80 transition-colors"
                onClick={handleLineHeightIncrease}
                disabled={lineHeight >= 2.0}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Scale Section */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-foreground block">View Scale</label>
        <div className="flex items-center gap-1.5 border border-muted bg-muted/40 rounded-lg p-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted/80 transition-colors"
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold tabular-nums flex-1 text-center">{Math.round(zoomLevel * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted/80 transition-colors"
            onClick={onZoomIn}
            disabled={zoomLevel >= 1.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="h-5 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted/80 transition-colors"
            onClick={onResetZoom}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-border/40">
      {/* -------------------- */}
      {/* DESKTOP VIEW         */}
      {/* -------------------- */}
      <div className="hidden md:flex items-center justify-between px-4 py-2.5 gap-2">
        {/* Left Group */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 hover:bg-muted/60">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border/50" />

          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="h-8 w-[140px] text-xs border-0 shadow-none bg-transparent hover:bg-muted/40 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="h-8 w-[120px] text-xs border-0 shadow-none bg-transparent hover:bg-muted/40 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 bg-muted/30 rounded px-1.5 py-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLineHeightDecrease}
              className="h-7 w-7 hover:bg-muted/60"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-semibold w-7 text-center">{lineHeight.toFixed(1)}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLineHeightIncrease}
              className="h-7 w-7 hover:bg-muted/60"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border/50" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsManageSectionsOpen(true)}
            className="h-8 gap-2 text-muted-foreground hover:bg-muted/40 transition-colors"
          >
            <ArrowDownUp className="h-4 w-4" /> <span className="text-xs font-medium">Sections</span>
          </Button>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/30 rounded px-1.5 py-0.5">
            <Button variant="ghost" size="icon" onClick={onZoomOut} className="h-7 w-7 hover:bg-muted/60">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-semibold w-9 text-center">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={onZoomIn} className="h-7 w-7 hover:bg-muted/60">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border/50" />
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 rounded px-2 py-1 transition-colors"
            onClick={() => dispatch({ type: "SET_EDITING_MODE", payload: !editMode })}
          >
            <Switch checked={editMode} className="scale-75" />
            <span className="text-xs font-medium text-muted-foreground">{editMode ? "Editing" : "View"}</span>
          </div>

          <Button onClick={handleExport} size="sm" className="h-8 gap-2 px-3 font-medium">
            <Download className="h-4 w-4" /> <span className="hidden lg:inline text-xs">Download</span>
          </Button>
        </div>
      </div>

      {/* -------------------- */}
      {/* MOBILE VIEW          */}
      {/* -------------------- */}
      <div className="flex md:hidden items-center justify-between px-3 py-2.5 gap-4">
        {/* Left Side: Navigation + Tools */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 hover:bg-muted/60">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Appearance Settings Sheet */}
          <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/60 mx-2">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[75vh]">
              <SheetHeader className="pb-4 border-b border-border/40">
                <SheetTitle className="text-base font-bold">Appearance Settings</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Customize your resume template, fonts, spacing and zoom level.
                </SheetDescription>
              </SheetHeader>

              {/* Sheet Content with proper padding */}
              <div className="px-1 py-2 overflow-y-auto">{renderDesignControls()}</div>
            </SheetContent>
          </Sheet>

          {/* Sections Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsManageSectionsOpen(true)}
            className="h-8 w-8 hover:bg-muted/60"
            title="Manage Sections"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 rounded px-2 py-1 transition-colors"
            onClick={() => dispatch({ type: "SET_EDITING_MODE", payload: !editMode })}
          >
            <span className="text-xs font-medium text-muted-foreground">{editMode ? "Editing" : "View"}</span>
            <Switch checked={editMode} className="scale-75" />
          </div>

          <Button size="icon" onClick={handleExport} className="h-8 w-8 font-medium">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shared Dialog for Managing Sections */}
      <ManageSections open={isManageSectionsOpen} onOpenChange={setIsManageSectionsOpen} />
    </div>
  )
}

export default SettingsNew
