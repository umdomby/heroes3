import { prisma } from '@/prisma/prisma-client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { globalDataPoints } from "@/app/actions";

interface GlobalData {
    id: number;
    margin: number | null;
    createdAt: Date;
    updatedAt: Date;
    ref: number | null;
    users: number;
    reg: number | null;
    usersPoints: number | null;
    openBetsPoints: number | null;
    betFund: number | null;
    gameUserBetOpen: number | null;
}

async function fetchGlobalData(): Promise<GlobalData[]> {
    try {
        const data = await prisma.globalData.findMany({
            orderBy: {
                id: 'desc', // Сортировка по id в порядке убывания
            },
        });
        return data;
    } catch (error) {
        console.error('Failed to fetch global data:', error);
        return [];
    }
}

export default async function StatisticsPage() {
    // Запускаем обновление данных
    await globalDataPoints();

    // Получаем обновленные данные
    const globalDataList = await fetchGlobalData();

    if (globalDataList.length === 0) {
        return <div>Нет доступных данных</div>;
    }

    return (
        <div>
            <Table style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#1f2937' }}>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Start</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Reg</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Ref</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Open</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>myGame</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>User</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Fund</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Margin</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Date</TableHead>
                        <TableHead style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Sum</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {globalDataList.map((globalData, index) => {
                        const totalSum =
                            (globalData.openBetsPoints ?? 0) +
                            (globalData.usersPoints ?? 0) +
                            (globalData.betFund ?? 0) +
                            (globalData.margin ?? 0) +
                            (globalData.gameUserBetOpen ?? 0);

                        // Условие для выделения первой записи
                        const isFirstRecord = index === 0;
                        const rowStyle = isFirstRecord
                            ? { backgroundColor: '#4c4c4c', transition: 'background-color 0.3s', cursor: 'pointer' }
                            : { transition: 'background-color 0.3s', cursor: 'pointer' };

                        return (
                            <TableRow key={globalData.id} style={rowStyle}>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#1db812' }}>11M</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#f1b11e' }}>{globalData.reg ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#a5e24a' }}>{globalData.ref ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#718dff' }}>{globalData.openBetsPoints ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#cdca59' }}>{globalData.gameUserBetOpen ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#cdca59' }}>{globalData.usersPoints ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#b541d3' }}>{globalData.betFund ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#2563eb' }}>{globalData.margin ?? 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#f64343' }}>{new Date(globalData.updatedAt).toLocaleString()}</TableCell>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#30ff00' }}>{Math.floor(totalSum * 100) / 100}</TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
