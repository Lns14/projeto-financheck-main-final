import { Outlet } from 'react-router';
import { TransactionsProvider } from './context/TransactionsContext';

export function Root() {
  return (
    <TransactionsProvider>
      <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif', background: 'linear-gradient(160deg, #E5EEFB 0%, #F5F9FF 30%, #FAFCFF 60%, #E8F1FC 100%)' }}>
        <div className="absolute top-[-150px] left-[15%] w-[900px] h-[900px] bg-gradient-to-br from-[#7BA8F5]/25 to-transparent rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-200px] right-[25%] w-[850px] h-[850px] bg-gradient-to-tl from-[#94B3E8]/30 to-transparent rounded-full blur-[200px]"></div>
        <div className="absolute top-[40%] left-[50%] w-[700px] h-[700px] bg-gradient-to-br from-[#C5D9F5]/20 to-transparent rounded-full blur-[220px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-[#A8C9F5]/18 to-transparent rounded-full blur-[180px]"></div>
        <div className="absolute bottom-[30%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-[#5B8FE8]/15 to-transparent rounded-full blur-[160px]"></div>

        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </TransactionsProvider>
  );
}
