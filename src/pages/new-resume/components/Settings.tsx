import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Settings as SettingsIcon, Palette, Type, FileText, Download } from 'lucide-react'

const Settings = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Settings Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <SettingsIcon className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold">Settings</h3>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Resume Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume Information
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                placeholder="e.g., Software Engineer Resume"
                defaultValue="My Professional Resume"
              />
            </div>
            
            <div>
              <Label htmlFor="resume-description">Description</Label>
              <Input
                id="resume-description"
                placeholder="Brief description of this resume"
                defaultValue="Software Engineer with 5+ years of experience"
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="modern">
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select defaultValue="inter">
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="opensans">Open Sans</SelectItem>
                  <SelectItem value="lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Layout
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="spacing">Line Spacing</Label>
              <Select defaultValue="1.5">
                <SelectTrigger>
                  <SelectValue placeholder="Select spacing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">Tight (1.2)</SelectItem>
                  <SelectItem value="1.5">Normal (1.5)</SelectItem>
                  <SelectItem value="1.8">Relaxed (1.8)</SelectItem>
                  <SelectItem value="2.0">Loose (2.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="margins">Page Margins</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Select margins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Narrow (0.5")</SelectItem>
                  <SelectItem value="standard">Standard (1")</SelectItem>
                  <SelectItem value="wide">Wide (1.5")</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="page-size">Page Size</Label>
              <Select defaultValue="a4">
                <SelectTrigger>
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                  <SelectItem value="legal">Legal (8.5 × 14 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="orientation">Orientation</Label>
              <Select defaultValue="portrait">
                <SelectTrigger>
                  <SelectValue placeholder="Select orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="p-4 border-t">
        <Button className="w-full bg-teal-500 hover:bg-teal-600">
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings