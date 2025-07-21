import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface SecuritySettingsProps {
  currentEmail: string;
  onEmailChange: (newEmail: string) => Promise<void>;
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function SecuritySettings({ 
  currentEmail, 
  onEmailChange, 
  onPasswordChange 
}: SecuritySettingsProps) {
  const [emailData, setEmailData] = useState({
    newEmail: "",
    emailPassword: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.newEmail.trim() || !emailData.emailPassword.trim()) {
      return;
    }

    if (emailData.newEmail === currentEmail) {
      return;
    }

    try {
      setIsUpdatingEmail(true);
      // For now, we'll just update the email. In a real app, you'd verify the password first
      await onEmailChange(emailData.newEmail);
      setEmailData({ newEmail: "", emailPassword: "" });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword.trim() || 
        !passwordData.newPassword.trim() || 
        !passwordData.confirmPassword.trim()) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword.length < 6) {
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await onPasswordChange(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const isEmailFormValid = () => {
    return (
      emailData.newEmail.trim() !== "" &&
      emailData.emailPassword.trim() !== "" &&
      emailData.newEmail !== currentEmail &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.newEmail)
    );
  };

  const isPasswordFormValid = () => {
    return (
      passwordData.currentPassword.trim() !== "" &&
      passwordData.newPassword.trim() !== "" &&
      passwordData.confirmPassword.trim() !== "" &&
      passwordData.newPassword === passwordData.confirmPassword &&
      passwordData.newPassword.length >= 6
    );
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Security Settings</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Change */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Change Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={currentEmail}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newEmail">
                  New Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => 
                    setEmailData(prev => ({ ...prev, newEmail: e.target.value }))
                  }
                  placeholder="Enter new email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword">
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="emailPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={emailData.emailPassword}
                    onChange={(e) => 
                      setEmailData(prev => ({ ...prev, emailPassword: e.target.value }))
                    }
                    placeholder="Confirm with current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {emailData.newEmail && !isEmailFormValid() && (
                <div className="text-sm text-red-600 space-y-1">
                  {emailData.newEmail === currentEmail && (
                    <p>• New email must be different from current email</p>
                  )}
                  {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.newEmail) && (
                    <p>• Please enter a valid email address</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={!isEmailFormValid() || isUpdatingEmail}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isUpdatingEmail ? "Updating..." : "Update Email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => 
                      setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))
                    }
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => 
                      setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                    }
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => 
                      setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {passwordData.newPassword && !isPasswordFormValid() && (
                <div className="text-sm text-red-600 space-y-1">
                  {passwordData.newPassword.length < 6 && (
                    <p>• Password must be at least 6 characters long</p>
                  )}
                  {passwordData.confirmPassword && 
                   passwordData.newPassword !== passwordData.confirmPassword && (
                    <p>• Passwords do not match</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={!isPasswordFormValid() || isUpdatingPassword}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 