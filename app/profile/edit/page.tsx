"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Globe, Languages, Briefcase, GraduationCap, Plus, X, Edit } from "lucide-react"
import Link from "next/link"

export default function ProfileEditPage() {
  const [skills, setSkills] = useState<string[]>(["Solana", "Smart Contracts", "React", "TypeScript", "DeFi", "NFTs"])
  const [newSkill, setNewSkill] = useState("")

  const [interests, setInterests] = useState<string[]>(["Blockchain", "Web3", "DeFi", "DAOs", "Open Source"])
  const [newInterest, setNewInterest] = useState("")

  const [languages, setLanguages] = useState<{ language: string; proficiency: string }[]>([
    { language: "English", proficiency: "native" },
    { language: "Spanish", proficiency: "intermediate" },
    { language: "Japanese", proficiency: "beginner" },
  ])

  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([
    { platform: "github", url: "https://github.com/alexchen" },
    { platform: "twitter", url: "https://twitter.com/alexchen" },
    { platform: "linkedin", url: "https://linkedin.com/in/alexchen" },
  ])

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "beginner" }])
  }

  const updateLanguage = (index: number, field: "language" | "proficiency", value: string) => {
    const updatedLanguages = [...languages]
    updatedLanguages[index][field] = value
    setLanguages(updatedLanguages)
  }

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }])
  }

  const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
    const updatedLinks = [...socialLinks]
    updatedLinks[index][field] = value
    setSocialLinks(updatedLinks)
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground">Update your personal and professional information</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/profile">Cancel</Link>
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-8">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture or avatar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-3xl">AC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Upload New Image</Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square JPG, PNG, or GIF, at least 400x400 pixels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Alex Chen" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" defaultValue="Alex" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="Web3 Developer & Smart Contract Specialist with 5+ years of experience building on Solana and other blockchains. Specialized in secure smart contract development, auditing, and frontend integration."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description that appears on your profile. Maximum 200 characters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="alex@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america_los_angeles">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america_los_angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="america_denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america_chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america_new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="europe_london">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="asia_tokyo">Japan Standard Time (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Personal Information</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Available for Work</Label>
                    <p className="text-sm text-muted-foreground">Show that you're open to new opportunities</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications about your account</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Account Settings</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Add information about your professional background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" defaultValue="Web3 Developer & Smart Contract Specialist" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Current Company/Organization</Label>
                  <Input id="company" defaultValue="Alex Chen Consulting" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ years</SelectItem>
                      <SelectItem value="3">3+ years</SelectItem>
                      <SelectItem value="5">5+ years</SelectItem>
                      <SelectItem value="10">10+ years</SelectItem>
                      <SelectItem value="15">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (USDC)</Label>
                  <Input id="hourlyRate" type="number" defaultValue="75" />
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button type="button" onClick={addSkill}>
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Professional Details</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Add your work history</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Briefcase className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Smart Contract Developer</div>
                        <div className="text-sm text-muted-foreground">CryptoDAO Collective</div>
                        <div className="text-sm text-muted-foreground">Mar 2023 - Present</div>
                        <p className="text-sm mt-2">
                          Developing and auditing smart contracts for the DAO's treasury management system.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Briefcase className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">UI/UX Consultant</div>
                        <div className="text-sm text-muted-foreground">Solana Builders</div>
                        <div className="text-sm text-muted-foreground">Feb 2023 - Mar 2023</div>
                        <p className="text-sm mt-2">
                          Redesigned the frontend interface for the Solana Builders marketplace, improving user
                          experience and transaction flow.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Master of Computer Science</div>
                        <div className="text-sm text-muted-foreground">Stanford University</div>
                        <div className="text-sm text-muted-foreground">2018 - 2020</div>
                        <p className="text-sm mt-2">Specialized in Distributed Systems and Blockchain Technology</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Bachelor of Science in Computer Science</div>
                        <div className="text-sm text-muted-foreground">University of California, Berkeley</div>
                        <div className="text-sm text-muted-foreground">2014 - 2018</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value="interests" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
                <CardDescription>Add topics you're interested in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Interests</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                        {interest}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an interest"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addInterest()}
                    />
                    <Button type="button" onClick={addInterest}>
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Interests</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>Add languages you speak</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Language"
                        value={lang.language}
                        onChange={(e) => updateLanguage(index, "language", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        value={lang.proficiency}
                        onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="fluent">Fluent</SelectItem>
                          <SelectItem value="native">Native</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" onClick={addLanguage}>
                  <Languages className="mr-2 h-4 w-4" />
                  Add Language
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Languages</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Add key achievements or highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="highlight1">Highlight 1</Label>
                  <Input
                    id="highlight1"
                    defaultValue="Developed a secure smart contract system that manages over $5M in assets"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlight2">Highlight 2</Label>
                  <Input id="highlight2" defaultValue="Contributed to 3 major open-source blockchain projects" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlight3">Highlight 3</Label>
                  <Input id="highlight3" defaultValue="Speaker at Solana Breakpoint 2024" />
                </div>

                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Highlight
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Highlights</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32">
                      <Select
                        value={link.platform}
                        onValueChange={(value) => updateSocialLink(index, "platform", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" onClick={addSocialLink}>
                  <Globe className="mr-2 h-4 w-4" />
                  Add Social Link
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Social Links</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Portfolio & Projects</CardTitle>
                <CardDescription>Showcase your work and projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input id="portfolio" defaultValue="https://alexchen.dev" />
                </div>

                <div className="space-y-2">
                  <Label>Featured Projects</Label>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">DeFi Lending Protocol</div>
                          <div className="text-sm text-muted-foreground">https://github.com/alexchen/defi-lending</div>
                          <p className="text-sm mt-2">
                            A decentralized lending protocol built on Solana with automated interest rate adjustments.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">NFT Marketplace</div>
                          <div className="text-sm text-muted-foreground">
                            https://github.com/alexchen/nft-marketplace
                          </div>
                          <p className="text-sm mt-2">
                            A marketplace for NFTs with royalty enforcement and multi-token support.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Portfolio & Projects</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
