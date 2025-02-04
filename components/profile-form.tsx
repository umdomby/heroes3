'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TFormRegisterValues, formRegisterSchema } from './modals/auth-modal/forms/schemas';
import { User } from '@prisma/client';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { Container } from './container';
import { Title } from './title';
import { FormInput } from './form';
import { Button } from '@/components/ui';
import { referralGet, updateUserInfo } from '@/app/actions';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
    data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
    const form = useForm({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            fullName: data.fullName,
            email: data.email,
            password: '',
            confirmPassword: '',
        },
    });

    const [referrals, setReferrals] = useState<any[]>([]); // State to hold referral data

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const referralData = await referralGet();
                setReferrals(referralData);
            } catch (error) {
                console.error('Error fetching referral data:', error);
            }
        };

        fetchReferrals();
    }, []);

    const onSubmit = async (data: TFormRegisterValues) => {
        try {
            await updateUserInfo({
                fullName: data.fullName,
                password: data.password,
            });

            toast.success('Данные обновлены 📝', {
                icon: '✅',
            });
        } catch (error) {
            toast.error('Ошибка при обновлении данных', {
                icon: '❌',
            });
        }
    };

    const onClickSignOut = () => {
        signOut({
            callbackUrl: '/',
        });
    };

    // Проверяем, что data.loginHistory является массивом
    const loginHistory = Array.isArray(data.loginHistory) ? data.loginHistory : [];

    return (
        <Container className="w-[98%]">
            <div className="flex flex-col gap-3 w-full mt-10">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    {/* Левая колонка: Форма (30% ширины) */}
                    <div className="w-full md:w-1/3 p-4 rounded-lg"> {/* Changed to 1/3 for 30% width */}
                        <Title text={`Личные данные | #${data.id}`} size="md" className="font-bold"/>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300">Email: {data.email}</label>
                            <label className="block text-sm font-medium text-gray-300">Card ID: {data.cardId}</label>
                        </div>

                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormInput name="fullName" label="Полное имя" required/>
                                <FormInput type="password" name="password" label="Новый пароль" required/>
                                <FormInput type="password" name="confirmPassword" label="Повторите пароль" required/>

                                <Button disabled={form.formState.isSubmitting} className="text-base mt-10"
                                        type="submit">
                                    Сохранить
                                </Button>

                                <Button
                                    onClick={onClickSignOut}
                                    variant="secondary"
                                    disabled={form.formState.isSubmitting}
                                    className="text-base"
                                    type="button"
                                >
                                    Выйти
                                </Button>
                            </form>
                        </FormProvider>
                    </div>

                    {/* Правая колонка: Аккордеон для истории входов и IP адресов рефералов (70% ширины) */}
                    <div className="w-full md:w-2/3 p-4 rounded-lg"> {/* Changed to 2/3 for 70% width */}
                        <Accordion type="single" collapsible>
                            <AccordionItem value="loginHistory">
                                <AccordionTrigger>История входов</AccordionTrigger>
                                <AccordionContent>
                                    {loginHistory.length > 0 ? (
                                        <div className="space-y-1">
                                            {loginHistory.map((entry: any, index: number) => (
                                                <div key={index} className="p-1 border border-gray-300 rounded-lg">
                                                    <p>
                                                        <strong>IP:</strong> {entry.ip}, {new Date(entry.lastLogin).toLocaleString()}, <strong>VPN:</strong> {entry.vpn ? 'Да' : 'Нет'}, {entry.loginCount}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>История входов отсутствует.</p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="referralIPs">
                                <AccordionTrigger>IP адреса рефералов</AccordionTrigger>
                                <AccordionContent>
                                    {referrals.length > 0 ? (
                                        <div className="space-y-1">
                                            {referrals.map((referral, index) => (
                                                <div key={index} className="p-1 border border-gray-300 rounded-lg">
                                                    <p className={referral.referralStatus ? 'text-green-600' : 'text-gray-400'}>
                                                        <strong>IP:</strong> {referral.referralIpAddress}, <strong>Дата:</strong> {new Date(referral.createdAt).toLocaleString()}, +{referral.referralPoints}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Нет данных о рефералах.</p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Новый блок для информации о банковских реквизитах */}
                            <AccordionItem value="bankDetails">
                                <AccordionTrigger>Реквизиты банков</AccordionTrigger>
                                <AccordionContent>
                                    <p>Здесь вы можете добавить информацию о банковских реквизитах.</p>
                                    {/* Добавьте форму или информацию о банковских реквизитах здесь */}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </Container>
    );
};
