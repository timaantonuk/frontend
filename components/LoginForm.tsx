'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SkipBtn from '@/components/SkipBtn';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Некорректный email'),

  password: z
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(100, 'Пароль слишком длинный'),
});

const socialNetworks = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png',
    fallback: 'Google',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/640px-Facebook_f_logo_%282021%29.svg.png',
    fallback: 'Facebook',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/VK_Compact_Logo_%282021-present%29.svg/800px-VK_Compact_Logo_%282021-present%29.svg.png',
    fallback: 'Vk',
  },
];

export function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values:');
  }

  return (
    <Form {...form}>
      <SkipBtn
        onClickFn={() => {
          redirect('/');
        }}
      />

      <div className="mb-10">
        <h1 className="headingMain mb-2">Авторизоваться</h1>
        <p>Войдите в систему, чтобы вернуться к</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>

      <p>или</p>

      <div className="flex justify-center gap-5">
        {socialNetworks.map(el => (
          <Avatar key={el.src}>
            <AvatarImage src={el.src} />
            <AvatarFallback>{el.fallback}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </Form>
  );
}
