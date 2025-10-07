'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(session?.user?.userType || 'INDIVIDUAL');

  // Общие поля
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inn, setInn] = useState('');

  // Физическое лицо
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ИП
  const [ipFullName, setIpFullName] = useState('');
  const [ipShortName, setIpShortName] = useState('');
  const [ipRegistrationAddress, setIpRegistrationAddress] = useState('');
  const [ipActualAddress, setIpActualAddress] = useState('');
  const [ipOgrnip, setIpOgrnip] = useState('');
  const [ipBankName, setIpBankName] = useState('');
  const [ipBik, setIpBik] = useState('');
  const [ipCorrAccount, setIpCorrAccount] = useState('');
  const [ipCheckingAccount, setIpCheckingAccount] = useState('');
  const [ipOkved, setIpOkved] = useState('');
  const [ipTaxSystem, setIpTaxSystem] = useState('');
  const [ipVatStatus, setIpVatStatus] = useState('');

  // ООО
  const [oooFullName, setOooFullName] = useState('');
  const [oooShortName, setOooShortName] = useState('');
  const [oooLegalAddress, setOooLegalAddress] = useState('');
  const [oooActualAddress, setOooActualAddress] = useState('');
  const [kpp, setKpp] = useState('');
  const [oooOgrn, setOooOgrn] = useState('');
  const [oooDirector, setOooDirector] = useState('');
  const [oooAccountant, setOooAccountant] = useState('');
  const [oooAuthorizedPerson, setOooAuthorizedPerson] = useState('');
  const [oooBankName, setOooBankName] = useState('');
  const [oooBik, setOooBik] = useState('');
  const [oooCorrAccount, setOooCorrAccount] = useState('');
  const [oooCheckingAccount, setOooCheckingAccount] = useState('');
  const [oooOkved, setOooOkved] = useState('');
  const [oooTaxSystem, setOooTaxSystem] = useState('');
  const [oooVatStatus, setOooVatStatus] = useState('');

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '');
      setPhone(session.user.phone || '');
      setInn(session.user.inn || '');
      setUserType(session.user.userType || 'INDIVIDUAL');

      // Физическое лицо
      setFirstName(session.user.firstName || '');
      setLastName(session.user.lastName || '');

      // ИП
      setIpFullName(session.user.ipFullName || '');
      setIpShortName(session.user.ipShortName || '');
      setIpRegistrationAddress(session.user.ipRegistrationAddress || '');
      setIpActualAddress(session.user.ipActualAddress || '');
      setIpOgrnip(session.user.ipOgrnip || '');
      setIpBankName(session.user.ipBankName || '');
      setIpBik(session.user.ipBik || '');
      setIpCorrAccount(session.user.ipCorrAccount || '');
      setIpCheckingAccount(session.user.ipCheckingAccount || '');
      setIpOkved(session.user.ipOkved || '');
      setIpTaxSystem(session.user.ipTaxSystem || '');
      setIpVatStatus(session.user.ipVatStatus || '');

      // ООО
      setOooFullName(session.user.oooFullName || '');
      setOooShortName(session.user.oooShortName || '');
      setOooLegalAddress(session.user.oooLegalAddress || '');
      setOooActualAddress(session.user.oooActualAddress || '');
      setKpp(session.user.kpp || '');
      setOooOgrn(session.user.oooOgrn || '');
      setOooDirector(session.user.oooDirector || '');
      setOooAccountant(session.user.oooAccountant || '');
      setOooAuthorizedPerson(session.user.oooAuthorizedPerson || '');
      setOooBankName(session.user.oooBankName || '');
      setOooBik(session.user.oooBik || '');
      setOooCorrAccount(session.user.oooCorrAccount || '');
      setOooCheckingAccount(session.user.oooCheckingAccount || '');
      setOooOkved(session.user.oooOkved || '');
      setOooTaxSystem(session.user.oooTaxSystem || '');
      setOooVatStatus(session.user.oooVatStatus || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation based on user type
      if (userType === 'INDIVIDUAL') {
        if (!firstName || !lastName || !phone || !email) {
          toast.error('Пожалуйста, заполните все обязательные поля');
          setLoading(false);
          return;
        }
      } else if (userType === 'IP') {
        if (!inn || !ipFullName || !firstName || !phone || !email) {
          toast.error('Пожалуйста, заполните все обязательные поля');
          setLoading(false);
          return;
        }
      } else if (userType === 'OOO') {
        if (!inn || !oooFullName || !phone || !email) {
          toast.error('Пожалуйста, заполните все обязательные поля');
          setLoading(false);
          return;
        }
      }

      const data: any = {
        email,
        phone,
        inn,
        userType,
      };

      // Add fields based on user type
      if (userType === 'INDIVIDUAL') {
        data.firstName = firstName;
        data.lastName = lastName;
      } else if (userType === 'IP') {
        data.firstName = firstName;
        data.lastName = lastName;
        data.ipFullName = ipFullName;
        data.ipShortName = ipShortName;
        data.ipRegistrationAddress = ipRegistrationAddress;
        data.ipActualAddress = ipActualAddress;
        data.ipOgrnip = ipOgrnip;
        data.ipBankName = ipBankName;
        data.ipBik = ipBik;
        data.ipCorrAccount = ipCorrAccount;
        data.ipCheckingAccount = ipCheckingAccount;
        data.ipOkved = ipOkved;
        data.ipTaxSystem = ipTaxSystem;
        data.ipVatStatus = ipVatStatus;
      } else if (userType === 'OOO') {
        data.oooFullName = oooFullName;
        data.oooShortName = oooShortName;
        data.oooLegalAddress = oooLegalAddress;
        data.oooActualAddress = oooActualAddress;
        data.kpp = kpp;
        data.oooOgrn = oooOgrn;
        data.oooDirector = oooDirector;
        data.oooAccountant = oooAccountant;
        data.oooAuthorizedPerson = oooAuthorizedPerson;
        data.oooBankName = oooBankName;
        data.oooBik = oooBik;
        data.oooCorrAccount = oooCorrAccount;
        data.oooCheckingAccount = oooCheckingAccount;
        data.oooOkved = oooOkved;
        data.oooTaxSystem = oooTaxSystem;
        data.oooVatStatus = oooVatStatus;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка обновления профиля');
      }

      const updatedUser = await response.json();

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          ...updatedUser,
        },
      });

      toast.success('Профиль успешно обновлен');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>
            Обновите информацию о вашем профиле
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Тип аккаунта */}
          <div className="space-y-2">
            <Label htmlFor="userType">Тип аккаунта *</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIVIDUAL">Физическое лицо</SelectItem>
                <SelectItem value="IP">Индивидуальный предприниматель (ИП)</SelectItem>
                <SelectItem value="OOO">Юридическое лицо (ООО)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Общие поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Физическое лицо */}
          {userType === 'INDIVIDUAL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* ИП */}
          {userType === 'IP' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН *</Label>
                  <Input
                    id="inn"
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipOgrnip">ОГРНИП</Label>
                  <Input
                    id="ipOgrnip"
                    value={ipOgrnip}
                    onChange={(e) => setIpOgrnip(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipFullName">Полное наименование *</Label>
                  <Input
                    id="ipFullName"
                    placeholder="Индивидуальный предприниматель Иванов Иван Иванович"
                    value={ipFullName}
                    onChange={(e) => setIpFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipShortName">Краткое наименование</Label>
                  <Input
                    id="ipShortName"
                    placeholder="ИП Иванов И.И."
                    value={ipShortName}
                    onChange={(e) => setIpShortName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipRegistrationAddress">Адрес регистрации</Label>
                  <Input
                    id="ipRegistrationAddress"
                    value={ipRegistrationAddress}
                    onChange={(e) => setIpRegistrationAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipActualAddress">Фактический адрес</Label>
                  <Input
                    id="ipActualAddress"
                    value={ipActualAddress}
                    onChange={(e) => setIpActualAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Банковские реквизиты</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ipBankName">Наименование банка</Label>
                    <Input
                      id="ipBankName"
                      value={ipBankName}
                      onChange={(e) => setIpBankName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipBik">БИК</Label>
                    <Input
                      id="ipBik"
                      value={ipBik}
                      onChange={(e) => setIpBik(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipCorrAccount">Корреспондентский счет</Label>
                    <Input
                      id="ipCorrAccount"
                      value={ipCorrAccount}
                      onChange={(e) => setIpCorrAccount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipCheckingAccount">Расчетный счет</Label>
                    <Input
                      id="ipCheckingAccount"
                      value={ipCheckingAccount}
                      onChange={(e) => setIpCheckingAccount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Налогообложение</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ipOkved">ОКВЭД</Label>
                    <Input
                      id="ipOkved"
                      value={ipOkved}
                      onChange={(e) => setIpOkved(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipTaxSystem">Система налогообложения</Label>
                    <Input
                      id="ipTaxSystem"
                      placeholder="УСН, ОСНО и т.д."
                      value={ipTaxSystem}
                      onChange={(e) => setIpTaxSystem(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ipVatStatus">Уплата НДС</Label>
                    <Input
                      id="ipVatStatus"
                      placeholder="С НДС / Без НДС"
                      value={ipVatStatus}
                      onChange={(e) => setIpVatStatus(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ООО */}
          {userType === 'OOO' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН *</Label>
                  <Input
                    id="inn"
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpp">КПП</Label>
                  <Input
                    id="kpp"
                    value={kpp}
                    onChange={(e) => setKpp(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oooOgrn">ОГРН</Label>
                  <Input
                    id="oooOgrn"
                    value={oooOgrn}
                    onChange={(e) => setOooOgrn(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oooFullName">Полное наименование *</Label>
                  <Input
                    id="oooFullName"
                    placeholder="Общество с ограниченной ответственностью"
                    value={oooFullName}
                    onChange={(e) => setOooFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oooShortName">Краткое наименование</Label>
                  <Input
                    id="oooShortName"
                    placeholder="ООО"
                    value={oooShortName}
                    onChange={(e) => setOooShortName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oooLegalAddress">Юридический адрес</Label>
                  <Input
                    id="oooLegalAddress"
                    value={oooLegalAddress}
                    onChange={(e) => setOooLegalAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oooActualAddress">Фактический адрес</Label>
                  <Input
                    id="oooActualAddress"
                    value={oooActualAddress}
                    onChange={(e) => setOooActualAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Ответственные лица</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oooDirector">Руководитель (должность, ФИО)</Label>
                    <Input
                      id="oooDirector"
                      placeholder="Генеральный директор Иванов Иван Иванович"
                      value={oooDirector}
                      onChange={(e) => setOooDirector(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oooAccountant">Главный бухгалтер</Label>
                    <Input
                      id="oooAccountant"
                      value={oooAccountant}
                      onChange={(e) => setOooAccountant(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oooAuthorizedPerson">Лицо, уполномоченное подписывать договоры</Label>
                    <Input
                      id="oooAuthorizedPerson"
                      value={oooAuthorizedPerson}
                      onChange={(e) => setOooAuthorizedPerson(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Банковские реквизиты</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oooBankName">Наименование банка</Label>
                    <Input
                      id="oooBankName"
                      value={oooBankName}
                      onChange={(e) => setOooBankName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oooBik">БИК</Label>
                    <Input
                      id="oooBik"
                      value={oooBik}
                      onChange={(e) => setOooBik(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oooCorrAccount">Корреспондентский счет</Label>
                    <Input
                      id="oooCorrAccount"
                      value={oooCorrAccount}
                      onChange={(e) => setOooCorrAccount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oooCheckingAccount">Расчетный счет</Label>
                    <Input
                      id="oooCheckingAccount"
                      value={oooCheckingAccount}
                      onChange={(e) => setOooCheckingAccount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Налогообложение</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oooOkved">ОКВЭД</Label>
                    <Input
                      id="oooOkved"
                      value={oooOkved}
                      onChange={(e) => setOooOkved(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oooTaxSystem">Система налогообложения</Label>
                    <Input
                      id="oooTaxSystem"
                      placeholder="УСН, ОСНО и т.д."
                      value={oooTaxSystem}
                      onChange={(e) => setOooTaxSystem(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="oooVatStatus">Уплата НДС</Label>
                    <Input
                      id="oooVatStatus"
                      placeholder="С НДС / Без НДС"
                      value={oooVatStatus}
                      onChange={(e) => setOooVatStatus(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
