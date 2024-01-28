import React from 'react';
import { MenuList, MenuListItem, Separator } from 'react95';
import { useAccount } from 'wagmi';

const App = () => {
  const { isConnected, address } = useAccount();
  return (
    <main>
      {/*<TaskBar list={<List></List>} />*/}
      {/*<Modal*/}
      {/*  closeModal={() => {}}*/}
      {/*  title="Ranking"*/}
      {/*  icon={<Explorer100 variant="16x16_4" />}*/}
      {/*  width="400"*/}
      {/*  height="600"*/}
      {/*  menu={[*/}
      {/*    {*/}
      {/*      name: 'File',*/}
      {/*      list: <List></List>,*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*>*/}
      {/*  <Frame className="w-full flex-1 p-1" bg="white" boxShadow="in" w={'100%'}>*/}
      {/*    <List.Item>View</List.Item>*/}
      {/*    <List.Divider />*/}
      {/*    <List.Item>Customize this Folder...</List.Item>*/}
      {/*    <List.Divider />*/}
      {/*    <List.Item>Arrange Icons</List.Item>*/}
      {/*    <List.Item>Line Up Icons</List.Item>*/}
      {/*    <List.Divider />*/}
      {/*    <List.Item>Refresh</List.Item>*/}
      {/*    <List.Divider />*/}
      {/*    <List.Item>Paste</List.Item>*/}
      {/*    <List.Item>Paste Shortcut</List.Item>*/}
      {/*    <List.Item>Undo Copy</List.Item>*/}
      {/*    <List.Divider />*/}
      {/*    <List.Item>New</List.Item>*/}
      {/*    <List.Divider />*/}
      {/*    <List.Item>Properties</List.Item>*/}
      {/*  </Frame>*/}
      {/*</Modal>*/}
      {/*<Modal*/}
      {/*  width="640"*/}
      {/*  height="640"*/}
      {/*  defaultPosition={{ x: 512, y: 112 }}*/}
      {/*  icon={<Computer variant="16x16_4" />}*/}
      {/*  title="Mocorush.exe"*/}
      {/*  closeModal={() => {}}*/}
      {/*  menu={[*/}
      {/*    {*/}
      {/*      name: 'File',*/}
      {/*      list: <List></List>,*/}
      {/*    },*/}
      {/*    {*/}
      {/*      name: 'Wallet',*/}
      {/*      list: (*/}
      {/*        <List>*/}
      {/*          <ConnectKitButton.Custom>*/}
      {/*            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {*/}
      {/*              return <List.Item onClick={show}>{isConnected ? 'Disconnect...' : 'Connect Wallet...'}</List.Item>;*/}
      {/*            }}*/}
      {/*          </ConnectKitButton.Custom>*/}
      {/*          <List.Divider />*/}
      {/*          <List.Item className="text-[#333333]" aria-disabled>*/}
      {/*            {address ?? 'Not Connected'}*/}
      {/*          </List.Item>*/}
      {/*        </List>*/}
      {/*      ),*/}
      {/*    },*/}
      {/*    {*/}
      {/*      name: 'About',*/}
      {/*      list: <List></List>,*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*>*/}
      {/*  <div className="w-full h-full flex flex-col items-center justify-center">*/}
      {/*    <h1 className="font-bold italic text-4xl text-gray-500" style={{ textShadow: 'white 2px 2px' }}>*/}
      {/*      MocoRUSH*/}
      {/*    </h1>*/}
      {/*    <p className="mt-4 text-base">Who will be the last one standing?</p>*/}

      {/*    <div className="w-full flex flex-row space-x-4">*/}
      {/*      <Fieldset legend="Round Deadline" className="flex-1 flex flex-col items-center justify-center px-2 pb-6">*/}
      {/*        <RoundInfo />*/}
      {/*      </Fieldset>*/}
      {/*      <Fieldset legend="Pool Information" className="flex-1 flex flex-col items-center justify-center px-2 pb-6">*/}
      {/*        <p className="text-sm">The winner will receive</p>*/}
      {/*        <h1 className="font-['Times'] text-3xl">1348 MOC</h1>*/}
      {/*      </Fieldset>*/}
      {/*    </div>*/}
      {/*    <ConnectKitButton />*/}
      {/*    <AccountStatus />*/}

      {/*    <div className="w-full flex flex-row space-x-4">*/}
      {/*      <Button className="flex-1 flex flex-row space-x-1 items-center !px-2">*/}
      {/*        <Shell3214 />*/}
      {/*        <span className="flex-1 text-center text-sm">Leaderboard</span>*/}
      {/*      </Button>*/}
      {/*      <Button className="flex-1 flex flex-row space-x-1 items-center !px-2">*/}
      {/*        <Sendmail2001 />*/}
      {/*        <span className="flex-1 text-center text-sm">Invite a Friend</span>*/}
      {/*      </Button>*/}
      {/*      <Button className="flex-1 flex flex-row space-x-1 items-center !px-2">*/}
      {/*        <Winhlp324001 />*/}
      {/*        <span className="flex-1 text-center text-sm">About Mocorush...</span>*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</Modal>*/}
      {/*<h1 className="text-3xl text-red-300 font-bold underline">Hello world!</h1>*/}
      {/*<Button>Click me!</Button>*/}
      <MenuList>
        <MenuListItem>🎤 Sing</MenuListItem>
        <MenuListItem>💃🏻 Dance</MenuListItem>
        <Separator />
        <MenuListItem disabled>😴 Sleep</MenuListItem>
      </MenuList>
    </main>
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
