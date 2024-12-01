import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";
import {
  ConnectButton,
  useConnectWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";

// export const Background = () => {
//   const wall = useSelector((state) => state.wallpaper);
//   const dispatch = useDispatch();

//   return (
//     <div className="background">
//       <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
//         <source src="https://cdn.prod.website-files.com/6425f546844727ce5fb9e5ab/6568a1c859ceca16cf4653d6_Var6-transcode.mp4" type="video/mp4" />
//       </video>
//       <img
//         src="img/asset/sui.png"
//         className="absolute top-6 right-6 w-auto h-14"
//         alt="Sui Logo"
//       />
//     </div>
//   );
// };

export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(img/wallpaper/${wall.src})`,
      }}
    ></div>
  );
};


export const BootScreen = (props) => {
  const dispatch = useDispatch();
  const wall = useSelector((state) => state.wallpaper);
  const [blackout, setBlackOut] = useState(false);

  useEffect(() => {
    if (props.dir < 0) {
      setTimeout(() => {
        console.log("blackout");
        setBlackOut(true);
      }, 4000);
    }
  }, [props.dir]);

  useEffect(() => {
    if (props.dir < 0) {
      if (blackout) {
        if (wall.act == "restart") {
          setTimeout(() => {
            setBlackOut(false);
            setTimeout(() => {
              dispatch({ type: "WALLBOOTED" });
            }, 4000);
          }, 2000);
        }
      }
    }
  }, [blackout]);

  return (
    <div className="bootscreen">
      <div className={blackout ? "hidden" : ""}>
        <Image src="asset/bootlogo" w={180} />
        <div className="mt-48" id="loader">
          <svg
            className="progressRing"
            height={48}
            width={48}
            viewBox="0 0 16 16"
          >
            <circle cx="8px" cy="8px" r="7px"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const LockScreen = (props) => {
  const wall = useSelector((state) => state.wallpaper);
  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [password, setPass] = useState("");
  const [passType, setType] = useState(1);
  const [forgot, setForget] = useState(false);
  const dispatch = useDispatch();

  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const account = useCurrentAccount();

  const userName = useSelector((state) => state.setting.person.name);

  const [isLoading, setIsLoading] = useState(false);

  const action = (e) => {
    var act = e.target.dataset.action,
      payload = e.target.dataset.payload;

    if (act == "splash") setLock(true);
    else if (act == "inpass") {
      var val = e.target.value;
      if (!passType) {
        val = val.substring(0, 4);
        val = !Number(val) ? "" : val;
      }

      setPass(val);
    } else if (act == "forgot") setForget(true);
    else if (act == "pinlock") setType(0);
    else if (act == "passkey") setType(1);

    if (act == "pinlock" || act == "passkey") setPass("");
  };

  const proceed = () => {
    setUnLock(true);
    setTimeout(() => {
      dispatch({ type: "WALLUNLOCK" });
    }, 1000);
  };

  const action2 = (e) => {
    if (e.key == "Enter") proceed();
  };

  useEffect(() => {
    if (account) {
      proceed();
    }
  }, [account]);

  return (
    <div
      className={"lockscreen realtive flex justify-center items-center bg-black/10 backdrop-blur-lg" + (props.dir == -1 ? "slowfadein" : "")}
      data-unlock={unlocked}
      // style={{
      // backgroundImage: `url(${`/img/wallpaper/lock.png`})`,
      // }}
      onClick={action}
      data-action="splash"
      data-blur={lock}
    >
      <div className="splashScreen absolute top-28" data-faded={lock}>
        <div className="text-6xl font-semibold text-gray-100">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
        <div className="text-lg font-medium text-gray-200">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="fadeinScreen backdrop-blur-sm bg-black/20 p-8 rounded-2xl shadow-2xl" data-faded={!lock} data-unlock={unlocked}>
        {/* Avatar */}
        <div className="relative group">
          <Image
            className="rounded-full object-cover overflow-hidden border-4 border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-105"
            src="/avatar/crat.png"
            w={150}
            h={150}
            ext
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/20"></div>
        </div>

        {/* Username */}
        <div className="mt-4 text-2xl font-bold text-white drop-shadow-lg">
          {userName}
        </div>

        {/* Wallet Installation Message */}
        <p className="flex items-center mt-8 text-white/90 text-sm backdrop-blur-md bg-white/10 p-3 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          You must install
          <a
            rel="noreferrer"
            target="_blank"
            className="mx-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            href="https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
          >
            Sui Wallet
          </a>
          first
        </p>

        {/* Wallet Connect Button */}
        <div className="mt-6">
          {wallets.map((wallet) => {
            if (wallet.name !== "Sui Wallet") return null;
            return (
              <ConnectButton
                key={wallet.name}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => {
                  setIsLoading(true);
                  connect(
                    { wallet },
                    {
                      onSuccess: () => {
                        console.log("connected");
                        setIsLoading(false);
                        proceed();
                      },
                      onError: () => {
                        setIsLoading(false);
                      }
                    }
                  );
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Connect Wallet
                  </div>
                )}
              </ConnectButton>
            );
          })}
        </div>

        {/* Disconnect Button */}
        {account && (
          <button
            className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-red-500/80 hover:bg-red-600/80 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            onClick={() => disconnect()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Disconnect
          </button>
        )}
      </div>

      <div className="bottomInfo flex">
        <Icon className="mx-2" src="wifi" ui width={16} invert />
        <Battery invert />
      </div>
    </div>
  );
};
