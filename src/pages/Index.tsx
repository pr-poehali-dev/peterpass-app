import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type Screen = 'auth' | 'main' | 'documents' | 'volunteer' | 'more';

type Document = {
  id: string;
  type: 'passport' | 'podorozhnik' | 'medcard';
  name: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  number?: string;
  series?: string;
  birthDate?: string;
  qrCode?: string;
  balance?: number;
};

type Intercom = {
  id: string;
  brand: string;
  provider: string;
  entrance: string;
  imageUrl: string;
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [intercoms, setIntercoms] = useState<Intercom[]>([]);
  
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showDocDetail, setShowDocDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showAddIntercom, setShowAddIntercom] = useState(false);
  const [showIntercomView, setShowIntercomView] = useState(false);
  const [selectedIntercom, setSelectedIntercom] = useState<Intercom | null>(null);
  
  const [showCreatePassport, setShowCreatePassport] = useState(false);
  const [showCreatePodorozhnik, setShowCreatePodorozhnik] = useState(false);
  const [showCreateMedcard, setShowCreateMedcard] = useState(false);
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [pendingDoc, setPendingDoc] = useState<Document | null>(null);
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Санкт-Петербург');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpMethod, setTopUpMethod] = useState<'sbp' | 'card'>('sbp');
  
  const [newDocFirstName, setNewDocFirstName] = useState('');
  const [newDocLastName, setNewDocLastName] = useState('');
  const [newDocMiddleName, setNewDocMiddleName] = useState('');
  const [newDocBirthDate, setNewDocBirthDate] = useState('');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newDocSeries, setNewDocSeries] = useState('');
  const [hasExistingPodorozhnik, setHasExistingPodorozhnik] = useState(false);
  
  const [intercomBrand, setIntercomBrand] = useState('');
  const [intercomProvider, setIntercomProvider] = useState('');
  const [intercomEntrance, setIntercomEntrance] = useState('');
  
  const { toast } = useToast();

  const playDoorSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==');
    audio.play().catch(() => {});
  };

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const podorozhnikDocs = documents.filter(d => d.type === 'podorozhnik' && d.balance && d.balance > 0);
      if (podorozhnikDocs.length > 0 && Math.random() < 0.1) {
        const randomDoc = podorozhnikDocs[Math.floor(Math.random() * podorozhnikDocs.length)];
        const deduction = Math.floor(Math.random() * 20) + 40;
        setDocuments(prev => prev.map(d => 
          d.id === randomDoc.id && d.balance ? { ...d, balance: Math.max(0, d.balance - deduction) } : d
        ));
        toast({ title: 'Списание', description: `Списано ${deduction} ₽ с карты ${randomDoc.name}` });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [documents, toast]);

  const handleAuth = () => {
    if (authMode === 'login') {
      if (!phone || !pin) {
        toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
        return;
      }
    } else {
      if (!phone || !pin || !firstName || !lastName) {
        toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
        return;
      }
    }
    toast({ title: 'Успешно', description: authMode === 'login' ? 'Вы вошли в систему' : 'Аккаунт создан' });
    setScreen('main');
  };

  const handleDemoMode = () => {
    setFirstName('Демо');
    setLastName('Пользователь');
    setScreen('main');
    toast({ title: 'Демо режим', description: 'Вы вошли в демо режим' });
  };

  const handleCreatePassport = () => {
    if (!newDocFirstName || !newDocLastName || !newDocBirthDate) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    const newDoc: Document = {
      id: Date.now().toString(),
      type: 'passport',
      name: 'Паспорт РФ',
      firstName: newDocFirstName,
      lastName: newDocLastName,
      middleName: newDocMiddleName,
      birthDate: newDocBirthDate,
      series: newDocSeries || Math.floor(1000 + Math.random() * 9000).toString(),
      number: newDocNumber || Math.floor(100000 + Math.random() * 900000).toString(),
      qrCode: generateQRCode(`PASSPORT:${newDocLastName} ${newDocFirstName}:${newDocBirthDate}`)
    };
    setPendingDoc(newDoc);
    setShowCreatePassport(false);
    setShowPinConfirm(true);
  };

  const handleCreatePodorozhnik = () => {
    if (!hasExistingPodorozhnik && (!newDocFirstName || !newDocLastName)) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    const cardNumber = newDocNumber || Math.floor(10000000 + Math.random() * 90000000).toString();
    const newDoc: Document = {
      id: Date.now().toString(),
      type: 'podorozhnik',
      name: 'Подорожник',
      firstName: newDocFirstName || firstName,
      lastName: newDocLastName || lastName,
      number: cardNumber,
      balance: 0,
      qrCode: generateQRCode(`PODOROZHNIK:${cardNumber}`)
    };
    setDocuments(prev => [...prev, newDoc]);
    setShowCreatePodorozhnik(false);
    resetNewDocFields();
    toast({ title: 'Успешно', description: 'Подорожник добавлен' });
  };

  const handleCreateMedcard = () => {
    if (!newDocFirstName || !newDocLastName || !newDocBirthDate) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    const newDoc: Document = {
      id: Date.now().toString(),
      type: 'medcard',
      name: 'Медицинская карта',
      firstName: newDocFirstName,
      lastName: newDocLastName,
      middleName: newDocMiddleName,
      birthDate: newDocBirthDate,
      number: Math.floor(1000000 + Math.random() * 9000000).toString(),
      qrCode: generateQRCode(`MEDCARD:${newDocLastName} ${newDocFirstName}:${newDocBirthDate}`)
    };
    setPendingDoc(newDoc);
    setShowCreateMedcard(false);
    setShowPinConfirm(true);
    
    toast({ title: 'Заявка отправлена', description: 'Ожидайте подтверждения врача (5-10 минут)' });
    setTimeout(() => {
      toast({ title: 'Подтверждено', description: 'Медицинская карта добавлена!' });
    }, 5000);
  };

  const handlePinConfirm = () => {
    if (!pin) {
      toast({ title: 'Ошибка', description: 'Введите PIN-код', variant: 'destructive' });
      return;
    }
    if (pendingDoc) {
      setDocuments(prev => [...prev, pendingDoc]);
      toast({ title: 'Успешно', description: 'Документ добавлен' });
      setPendingDoc(null);
      resetNewDocFields();
    }
    setShowPinConfirm(false);
  };

  const resetNewDocFields = () => {
    setNewDocFirstName('');
    setNewDocLastName('');
    setNewDocMiddleName('');
    setNewDocBirthDate('');
    setNewDocNumber('');
    setNewDocSeries('');
    setHasExistingPodorozhnik(false);
  };

  const handleTopUp = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }
    const amount = parseFloat(topUpAmount);
    const podorozhnikDoc = documents.find(d => d.type === 'podorozhnik');
    if (podorozhnikDoc) {
      setDocuments(prev => prev.map(d => 
        d.id === podorozhnikDoc.id ? { ...d, balance: (d.balance || 0) + amount } : d
      ));
      toast({ 
        title: 'Пополнено', 
        description: `Пополнено через ${topUpMethod === 'sbp' ? 'СБП' : 'банковскую карту'} на ${amount} ₽` 
      });
      setShowTopUp(false);
      setTopUpAmount('');
    }
  };

  const handleDeleteDoc = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setShowDocDetail(false);
    toast({ title: 'Удалено', description: 'Документ удалён' });
  };

  const handleAddIntercom = () => {
    if (!intercomBrand || !intercomProvider || !intercomEntrance) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    const newIntercom: Intercom = {
      id: Date.now().toString(),
      brand: intercomBrand,
      provider: intercomProvider,
      entrance: intercomEntrance,
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
    };
    setIntercoms(prev => [...prev, newIntercom]);
    setShowAddIntercom(false);
    toast({ title: 'Успешно', description: 'Домофон добавлен' });
    setIntercomBrand('');
    setIntercomProvider('');
    setIntercomEntrance('');
  };

  const handleOpenIntercom = () => {
    playDoorSound();
    toast({ title: 'Домофон открыт', description: '🔓 Дверь открыта' });
  };

  const podorozhnikDoc = documents.find(d => d.type === 'podorozhnik');

  if (screen === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Icon name="Building2" className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Петербуржец</h1>
            <p className="text-muted-foreground text-sm">Ваши документы и сервисы в одном приложении</p>
          </div>

          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label>Номер телефона</Label>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>PIN-код</Label>
                <Input
                  type="password"
                  placeholder="____"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleAuth}>
                Войти
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label>Имя</Label>
                <Input
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Фамилия</Label>
                <Input
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Отчество (необязательно)</Label>
                <Input
                  placeholder="Иванович"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Номер телефона</Label>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Придумайте PIN-код (4 цифры)</Label>
                <Input
                  type="password"
                  placeholder="____"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleAuth}>
                Создать аккаунт
              </Button>
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Или войти через</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Icon name="Shield" size={18} className="mr-2" />
                Госуслуги
              </Button>
              <Button variant="outline" className="w-full">
                <Icon name="MessageCircle" size={18} className="mr-2" />
                ВКонтакте
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={handleDemoMode}>
              Демо режим
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {screen === 'main' && (
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Главная</h2>
              <p className="text-sm text-muted-foreground">
                {firstName} {lastName}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAddressDialog(true)}
              className="rounded-full"
            >
              <Icon name="MapPin" size={20} />
            </Button>
          </div>

          {podorozhnikDoc && (
            <Card 
              className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 shadow-lg border-0 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setShowTopUp(true)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="CreditCard" size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-90">Подорожник</p>
                    <p className="font-semibold">№ {podorozhnikDoc.number}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoc(podorozhnikDoc);
                    setShowDocDetail(true);
                  }}
                >
                  <Icon name="Settings" size={18} />
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm opacity-90">Баланс</p>
                <p className="text-3xl font-bold">{podorozhnikDoc.balance || 0} ₽</p>
              </div>
              <Button variant="secondary" size="sm" className="mt-3 w-full">
                Пополнить
              </Button>
            </Card>
          )}

          {documents.filter(d => d.type === 'passport').map(doc => (
            <Card 
              key={doc.id}
              className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 shadow-lg border-0 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => {
                setSelectedDoc(doc);
                setShowDocDetail(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon name="BookOpen" size={24} />
                  </div>
                  <div>
                    <p className="text-xs opacity-90">{doc.name}</p>
                    <p className="font-semibold text-lg">{doc.series} {doc.number}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {doc.lastName} {doc.firstName[0]}.{doc.middleName ? doc.middleName[0] + '.' : ''}
                    </p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} />
              </div>
            </Card>
          ))}

          <Card className="bg-gradient-to-br from-sky-400 to-blue-500 text-white p-4 shadow-lg border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Cloud" size={24} />
                <span className="font-semibold">Погода</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">+2°</p>
              </div>
            </div>
            <p className="text-sm opacity-90">
              {address || 'Санкт-Петербург'} • Облачно
            </p>
          </Card>

          <Card className="p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Home" size={20} className="text-primary" />
                <h3 className="font-semibold">Рекомендации по дому</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Lightbulb" size={18} className="text-amber-500" />
                  <span className="text-sm">Оплатить электричество</span>
                </div>
                <Icon name="ChevronRight" size={16} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Droplet" size={18} className="text-blue-500" />
                  <span className="text-sm">Оплатить воду</span>
                </div>
                <Icon name="ChevronRight" size={16} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Flame" size={18} className="text-red-500" />
                  <span className="text-sm">Оплатить отопление</span>
                </div>
                <Icon name="ChevronRight" size={16} />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3">
              Оплатить всё сразу
            </Button>
          </Card>
        </div>
      )}

      {screen === 'documents' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Документы</h2>
            <Button
              size="icon"
              className="rounded-full"
              onClick={() => setShowAddDoc(true)}
            >
              <Icon name="Plus" size={20} />
            </Button>
          </div>

          {documents.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Документов пока нет</p>
              <p className="text-sm text-muted-foreground">Нажмите + чтобы добавить</p>
            </div>
          )}

          {documents.map(doc => (
            <Card 
              key={doc.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedDoc(doc);
                setShowDocDetail(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  doc.type === 'passport' ? 'bg-blue-100' :
                  doc.type === 'podorozhnik' ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <Icon 
                    name={doc.type === 'passport' ? 'BookOpen' : doc.type === 'podorozhnik' ? 'CreditCard' : 'Heart'} 
                    size={24} 
                    className={
                      doc.type === 'passport' ? 'text-blue-600' :
                      doc.type === 'podorozhnik' ? 'text-orange-600' : 'text-green-600'
                    }
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.type === 'podorozhnik' ? `№ ${doc.number}` : `${doc.series || ''} ${doc.number || ''}`}
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} />
              </div>
            </Card>
          ))}

          <Dialog open={showAddDoc} onOpenChange={setShowAddDoc}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить документ</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    setShowAddDoc(false);
                    setShowCreatePassport(true);
                  }}
                >
                  <Icon name="BookOpen" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Паспорт РФ / Загранпаспорт</p>
                    <p className="text-xs text-muted-foreground">Требуется подтверждение</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    setShowAddDoc(false);
                    setShowCreatePodorozhnik(true);
                  }}
                >
                  <Icon name="CreditCard" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Подорожник</p>
                    <p className="text-xs text-muted-foreground">Создать новую карту</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    setShowAddDoc(false);
                    setShowCreateMedcard(true);
                  }}
                >
                  <Icon name="Heart" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Медицинская карта</p>
                    <p className="text-xs text-muted-foreground">Требуется подтверждение врача</p>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {screen === 'volunteer' && (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Волонтёрство</h2>
          <p className="text-muted-foreground mb-4">Выберите доброе дело, в котором хотите участвовать</p>

          {[
            { icon: 'Heart', title: 'Помощь пожилым', desc: 'Доставка продуктов и лекарств' },
            { icon: 'TreePine', title: 'Посадка деревьев', desc: 'Озеленение города' },
            { icon: 'Trash2', title: 'Уборка территорий', desc: 'Экологические акции' },
            { icon: 'Users', title: 'Помощь детям', desc: 'Образовательные программы' },
            { icon: 'Utensils', title: 'Столовая для нуждающихся', desc: 'Раздача горячей еды' },
            { icon: 'BookOpen', title: 'Библиотека', desc: 'Помощь в организации мероприятий' },
            { icon: 'Paw', title: 'Приют для животных', desc: 'Помощь бездомным животным' },
            { icon: 'GraduationCap', title: 'Репетиторство', desc: 'Бесплатные занятия для детей' },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                toast({ title: item.title, description: 'Заявка на участие отправлена!' })
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name={item.icon as any} size={24} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Icon name="ChevronRight" size={20} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {screen === 'more' && (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Ещё</h2>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {firstName[0]}
                {lastName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {lastName} {firstName} {middleName}
                </h3>
                <p className="text-sm text-muted-foreground">{phone}</p>
                {email && <p className="text-sm text-muted-foreground">{email}</p>}
                {birthDate && <p className="text-sm text-muted-foreground">Дата рождения: {birthDate}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEditProfile(true)}>
                <Icon name="Pencil" size={18} />
              </Button>
            </div>
          </Card>

          {address && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">Адрес</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Умные домофоны</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddIntercom(true)}
                  >
                    <Icon name="Plus" size={16} className="mr-1" />
                    Добавить
                  </Button>
                </div>
                {intercoms.map(intercom => (
                  <Card 
                    key={intercom.id}
                    className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedIntercom(intercom);
                      setShowIntercomView(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="DoorOpen" size={18} className="text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{intercom.brand}</p>
                        <p className="text-xs text-muted-foreground">Подъезд {intercom.entrance} • {intercom.provider}</p>
                      </div>
                      <Icon name="ChevronRight" size={16} />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Icon name="Settings" size={20} className="text-muted-foreground" />
              <span className="font-medium">Настройки</span>
            </div>
          </Card>

          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Icon name="HelpCircle" size={20} className="text-muted-foreground" />
              <span className="font-medium">Помощь</span>
            </div>
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setScreen('auth');
              toast({ title: 'Выход', description: 'Вы вышли из аккаунта' });
            }}
          >
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти из аккаунта
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              setScreen('auth');
              setFirstName('');
              setLastName('');
              setMiddleName('');
              setPhone('');
              setPin('');
              setAddress('');
              setDocuments([]);
              setIntercoms([]);
              toast({
                title: 'Аккаунт удалён',
                description: 'Все данные удалены',
                variant: 'destructive',
              });
            }}
          >
            <Icon name="Trash2" size={18} className="mr-2" />
            Удалить аккаунт
          </Button>
        </div>
      )}

      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Укажите адрес</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Город</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                  <SelectItem value="Москва">Москва</SelectItem>
                  <SelectItem value="Шушары">Шушары</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Номер дома</Label>
              <Input placeholder="Например: 12" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Квартира</Label>
              <Input placeholder="Например: 45" value={apartment} onChange={(e) => setApartment(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Лицевой счёт (необязательно)</Label>
              <Input placeholder="Для оплаты услуг" />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setAddress(`${city}, ул. Невский, д. ${houseNumber || '12'}, кв. ${apartment || '45'}`);
                setShowAddressDialog(false);
                toast({ title: 'Адрес сохранён', description: 'Теперь доступны функции умного дома' });
              }}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Фамилия</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Отчество</Label>
              <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email (необязательно)</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Дата рождения (необязательно)</Label>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowEditProfile(false);
                toast({ title: 'Сохранено', description: 'Профиль обновлён' });
              }}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTopUp} onOpenChange={setShowTopUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пополнить Подорожник</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Сумма пополнения</Label>
              <Input 
                type="number" 
                placeholder="Введите сумму" 
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Способ оплаты</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={`p-4 cursor-pointer transition-all ${topUpMethod === 'sbp' ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setTopUpMethod('sbp')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="Smartphone" size={24} />
                    <span className="text-sm font-medium">СБП</span>
                  </div>
                </Card>
                <Card 
                  className={`p-4 cursor-pointer transition-all ${topUpMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setTopUpMethod('card')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="CreditCard" size={24} />
                    <span className="text-sm font-medium">Карта</span>
                  </div>
                </Card>
              </div>
            </div>
            <Button className="w-full" onClick={handleTopUp}>
              Пополнить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDocDetail} onOpenChange={setShowDocDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDoc?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDoc?.qrCode && (
              <div className="flex justify-center py-4">
                <img src={selectedDoc.qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm"><strong>ФИО:</strong> {selectedDoc?.lastName} {selectedDoc?.firstName} {selectedDoc?.middleName}</p>
              {selectedDoc?.birthDate && <p className="text-sm"><strong>Дата рождения:</strong> {selectedDoc?.birthDate}</p>}
              {selectedDoc?.number && <p className="text-sm"><strong>Номер:</strong> {selectedDoc?.series} {selectedDoc?.number}</p>}
              {selectedDoc?.balance !== undefined && <p className="text-sm"><strong>Баланс:</strong> {selectedDoc?.balance} ₽</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Icon name="Pencil" size={16} className="mr-2" />
                Редактировать
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => selectedDoc && handleDeleteDoc(selectedDoc.id)}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatePassport} onOpenChange={setShowCreatePassport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать паспорт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input value={newDocFirstName} onChange={(e) => setNewDocFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Фамилия</Label>
              <Input value={newDocLastName} onChange={(e) => setNewDocLastName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Отчество (необязательно)</Label>
              <Input value={newDocMiddleName} onChange={(e) => setNewDocMiddleName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Дата рождения</Label>
              <Input type="date" value={newDocBirthDate} onChange={(e) => setNewDocBirthDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Серия (необязательно)</Label>
              <Input placeholder="1234" value={newDocSeries} onChange={(e) => setNewDocSeries(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Номер (необязательно)</Label>
              <Input placeholder="123456" value={newDocNumber} onChange={(e) => setNewDocNumber(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleCreatePassport}>
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatePodorozhnik} onOpenChange={setShowCreatePodorozhnik}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить Подорожник</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Уже есть карта Подорожник?</Label>
              <Switch checked={hasExistingPodorozhnik} onCheckedChange={setHasExistingPodorozhnik} />
            </div>
            {hasExistingPodorozhnik ? (
              <div className="space-y-2">
                <Label>Номер карты</Label>
                <Input placeholder="12345678" value={newDocNumber} onChange={(e) => setNewDocNumber(e.target.value)} />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input value={newDocFirstName} onChange={(e) => setNewDocFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Фамилия</Label>
                  <Input value={newDocLastName} onChange={(e) => setNewDocLastName(e.target.value)} />
                </div>
              </>
            )}
            <Button className="w-full" onClick={handleCreatePodorozhnik}>
              {hasExistingPodorozhnik ? 'Добавить' : 'Создать новый'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateMedcard} onOpenChange={setShowCreateMedcard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить медицинскую карту</DialogTitle>
            <DialogDescription>Требуется подтверждение врача</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input value={newDocFirstName} onChange={(e) => setNewDocFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Фамилия</Label>
              <Input value={newDocLastName} onChange={(e) => setNewDocLastName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Отчество (необязательно)</Label>
              <Input value={newDocMiddleName} onChange={(e) => setNewDocMiddleName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Дата рождения</Label>
              <Input type="date" value={newDocBirthDate} onChange={(e) => setNewDocBirthDate(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleCreateMedcard}>
              Подать заявку
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPinConfirm} onOpenChange={setShowPinConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите действие</DialogTitle>
            <DialogDescription>Введите PIN-код для подтверждения</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>PIN-код</Label>
              <Input 
                type="password" 
                placeholder="____" 
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handlePinConfirm}>
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddIntercom} onOpenChange={setShowAddIntercom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить домофон</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Марка домофона</Label>
              <Select value={intercomBrand} onValueChange={setIntercomBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите марку" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beward">Beward</SelectItem>
                  <SelectItem value="Visit">Visit</SelectItem>
                  <SelectItem value="Cyfral">Cyfral</SelectItem>
                  <SelectItem value="Eltis">Eltis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Провайдер</Label>
              <Select value={intercomProvider} onValueChange={setIntercomProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите провайдера" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Телеком">Телеком</SelectItem>
                  <SelectItem value="Дом.ру">Дом.ру</SelectItem>
                  <SelectItem value="Ростелеком">Ростелеком</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Подъезд</Label>
              <Input placeholder="Номер подъезда" value={intercomEntrance} onChange={(e) => setIntercomEntrance(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleAddIntercom}>
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showIntercomView} onOpenChange={setShowIntercomView}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Домофон {selectedIntercom?.brand}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedIntercom && (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={selectedIntercom.imageUrl} 
                  alt="Домофон" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm">Подъезд {selectedIntercom.entrance}</p>
                  <p className="text-white/80 text-xs">{selectedIntercom.provider}</p>
                </div>
              </div>
            )}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleOpenIntercom}
            >
              <Icon name="DoorOpen" size={20} className="mr-2" />
              Открыть домофон
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="grid grid-cols-4 h-16">
          {[
            { id: 'main', icon: 'Home', label: 'Главная' },
            { id: 'documents', icon: 'FileText', label: 'Документы' },
            { id: 'volunteer', icon: 'Heart', label: 'Волонтёрство' },
            { id: 'more', icon: 'Menu', label: 'Ещё' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as Screen)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                screen === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Index;
