import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type Screen = 'auth' | 'main' | 'documents' | 'volunteer' | 'more';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [balance, setBalance] = useState(520);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [address, setAddress] = useState('');
  const { toast } = useToast();

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

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 shadow-lg border-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="CreditCard" size={20} />
                </div>
                <div>
                  <p className="text-xs opacity-90">Подорожник</p>
                  <p className="font-semibold">№ 1234 5678</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Icon name="Settings" size={18} />
              </Button>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-90">Баланс</p>
              <p className="text-3xl font-bold">{balance} ₽</p>
            </div>
            <Button variant="secondary" size="sm" className="mt-3 w-full">
              Пополнить
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 shadow-lg border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="BookOpen" size={24} />
                </div>
                <div>
                  <p className="text-xs opacity-90">Паспорт РФ</p>
                  <p className="font-semibold text-lg">•••• 123456</p>
                  <p className="text-xs opacity-75 mt-1">
                    {lastName} {firstName[0]}.{middleName ? middleName[0] + '.' : ''}
                  </p>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} />
            </div>
          </Card>

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

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Паспорт РФ</h3>
                <p className="text-sm text-muted-foreground">•••• 123456</p>
              </div>
              <Icon name="ChevronRight" size={20} />
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={24} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Подорожник</h3>
                <p className="text-sm text-muted-foreground">№ 1234 5678</p>
              </div>
              <Icon name="ChevronRight" size={20} />
            </div>
          </Card>

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
                    toast({ title: 'Добавление паспорта', description: 'Функция в разработке' });
                    setShowAddDoc(false);
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
                    toast({ title: 'Добавление карты', description: 'Функция в разработке' });
                    setShowAddDoc(false);
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
                    toast({ title: 'Медицинская карта', description: 'Функция в разработке' });
                    setShowAddDoc(false);
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
              </div>
              <Button variant="ghost" size="icon">
                <Icon name="Pencil" size={18} />
              </Button>
            </div>
          </Card>

          {address && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">Адрес</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({ title: 'Умный домофон', description: 'Функция в разработке' })
                  }
                >
                  Умный домофон
                </Button>
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
              <select className="w-full p-2 border rounded-md">
                <option>Санкт-Петербург</option>
                <option>Москва</option>
                <option>Шушары</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Номер дома</Label>
              <Input placeholder="Например: 12" />
            </div>
            <div className="space-y-2">
              <Label>Квартира</Label>
              <Input placeholder="Например: 45" />
            </div>
            <div className="space-y-2">
              <Label>Лицевой счёт (необязательно)</Label>
              <Input placeholder="Для оплаты услуг" />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setAddress('Санкт-Петербург, ул. Невский, д. 12, кв. 45');
                setShowAddressDialog(false);
                toast({ title: 'Адрес сохранён', description: 'Теперь доступны функции умного дома' });
              }}
            >
              Сохранить
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
