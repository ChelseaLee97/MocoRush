import React from 'react';
import { BatExec, Jdbgmgr100, Shell3236 } from '@react95/icons';
import { ConnectKitButton } from 'connectkit';
import {
  AppBar,
  Button,
  GroupBox,
  ScrollView,
  Tab,
  TabBody,
  Tabs,
  TextInput,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
} from 'react95';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { CurrentRoundInfo } from '~/components/CurrentRoundInfo.tsx';
import { RewardTab } from '~/components/RewardTab.tsx';
import { RoundTab } from '~/components/RoundTab.tsx';

type Tab = 'round' | 'reward' | 'history';

const App = () => {
  const { isConnected, address } = useAccount();
  const [currentTab, setCurrentTab] = React.useState<Tab>('round');
  return (
    <div className="w-screen min-h-screen flex justify-center items-center pb-10">
      <main className="w-[1280px] flex flex-row space-x-4">
        <Window className="flex-1">
          <WindowHeader className="flex items-center justify-between">
            <span></span>
            <Button>
              <span className="w-4 h-4">X</span>
            </Button>
          </WindowHeader>

          <div className="flex flex-col m-1">
            <div className="w-full h-[54px] flex flex-row items-center px-2 mb-2">
              <Jdbgmgr100 className="w-10 h-10 mr-2" />
              <h1 className="text-3xl font-bold italic text-black" style={{ textShadow: 'white 2px 2px' }}>
                MocoRush
              </h1>
              <div className="flex-grow" />
              <ConnectKitButton />
            </div>
            <CurrentRoundInfo className="mb-4" />
            <GroupBox label="Description" className="mx-2 flex-1 flex flex-col">
              <span>
                The one who pressed the button last will win the <b>50% of the prize</b>. <br />
                Every time you press the button, the round will be extended by 1 hour. <br />
                Use your ticket to press the button!
              </span>
            </GroupBox>
          </div>
        </Window>
        <Window className="flex-1 !flex flex-col">
          <WindowHeader className="flex items-center justify-between">
            <span></span>
            <Button>
              <span className="w-4 h-4">X</span>
            </Button>
          </WindowHeader>
          <WindowContent className="flex-1 flex flex-col">
            <Tabs value={currentTab} onChange={(value) => setCurrentTab(value as Tab)}>
              <Tab value="round">Current Round</Tab>
              <Tab value="reward">Your Reward</Tab>
              <Tab value="history">Round History</Tab>
              <Tab value="history">Settings</Tab>
            </Tabs>
            <TabBody className="flex-1">
              {currentTab === 'round' && <RoundTab />}
              {currentTab === 'reward' && <RewardTab />}
            </TabBody>
          </WindowContent>
        </Window>
      </main>
      <AppBar className="fixed bottom-0 left-0 right-0" style={{ top: 'inherit' }}>
        <Toolbar className="justify-between">
          <div className="flex flex-row">
            <Button className="font-bold mr-2">
              <Jdbgmgr100 className="w-5 h-5 mr-1" />
              Start
            </Button>
            <Button active className="mr-2">
              <BatExec className="w-4 h-4 mr-1" />
              MocoRush.exe
            </Button>
            <Button>
              <Shell3236 className="w-4 h-4 mr-1" />
              Control.exe
            </Button>
          </div>
          <TextInput placeholder="Search..." width={150} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

// Make sure that this component is wrapped with ConnectKitProvider
const AccountStatus = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

export default App;
