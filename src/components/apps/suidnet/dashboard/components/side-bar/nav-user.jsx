import React from "react";
import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Wallet,
  Settings,
  Activity,
  History,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { getBalance } from "../../../utils/suiClient";

export function NavUser({
  user,
}) {
  const account = useCurrentAccount();
  const [balance, setBalance] = React.useState('0.00');
  const { isMobile } = useSidebar()

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        try {
          const balanceData = await getBalance(account.address);
          setBalance(balanceData);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('0.00');
        }
      }
    };

    fetchBalance();
  }, [account?.address]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={account?.address} />
                <AvatarFallback className="rounded-lg">
                  {account?.address?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{shortenAddress(account?.address)}</span>
                <span className="truncate text-xs flex items-center gap-1">
                  <Activity className="size-3" />
                  {user.status || 'Online'} {/* Trạng thái hoạt động */}
                  <div className="mt-1 size-2 bg-green-500 rounded-full"></div>
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {account?.address?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{shortenAddress(account?.address)}</span>
                  {/* <span className="truncate text-xs text-muted-foreground">
                    {shortenAddress(account?.address)}
                  </span> */}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Wallet className="mr-2 size-4" />
                Balance
                <span className="ml-auto text-xs text-muted-foreground">
                  {balance}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 size-4" />
                Deposit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="mr-2 size-4" />
                Transaction History
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
