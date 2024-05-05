import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
import Button from "../../button";
import { AiFillCheckCircle } from "react-icons/ai";
import { infoToast } from "../../toast";
import { BiCheckCircle } from "react-icons/bi";
import { Wallet } from "@subwallet/wallet-connect/types";
import { useMobileDetect } from "@/app/hooks/useMobileDetect";

const WalletModal = ({
  open,
  setOpen,
  wallets,
  handleWalletSelections,
  extensions,
  extensionSelected,
  setSelectExtension,
  isConnected,
  setWallets,
}: {
  open: boolean;
  setOpen: (args: boolean) => void;
  wallets: InjectedAccountWithMeta[] | [];
  handleWalletSelections: (arg: InjectedAccountWithMeta) => void;
  extensions: Wallet[];
  extensionSelected: Wallet | null;
  setSelectExtension: (arg: Wallet) => void;
  isConnected: boolean;
  setWallets: (arg: InjectedAccountWithMeta[]) => void;
}) => {
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>();
  const isMobile = useMobileDetect();
  return (
    <Modal open={open} onClose={() => setOpen(false)} center>
      Choose your polkadot wallet to connect
      <hr className="my-3" />
      <div className="flex flex-row gap-4">
        <div className="flex w-[250px] flex-col gap-y-4 max-h-[280px] overflow-y-scroll no-scrollbar">
          {extensions
            .sort((a, b) => {
              if (a.installed && !b.installed) return -1;
              if (!a.installed && b.installed) return 1;
              return 0;
            })
            .filter((each) => {
              return !isMobile ? each.title != "Nova Wallet" : true;
            })
            .map((wallet) => (
              <div key={wallet.title} className="w-full">
                <button
                  type="button"
                  className={`flex w-full items-center disabled:cursor-not-allowed hover:bg-info/60 gap-4 ${
                    extensionSelected?.title === wallet.title
                      ? "bg-green-50"
                      : "bg-info/60"
                  } gap-4 px-4 py-2 rounded-xl cursor-pointer shadow-md`}
                  onClick={async () => {
                    if (!wallet.installed) return;
                    setWallets([]);
                    // wallet.extension.
                    // const extensions = await polkadotApi?.web3Enable?.(
                    //   "Comsol Bridge " + wallet.title
                    // );
                    // if (!extensions) return;
                    wallet
                      .enable()
                      .then(() => {
                        setSelectExtension(wallet);
                        wallet
                          .getAccounts()
                          .then((accounts) => {
                            accounts &&
                              setWallets(
                                accounts.map((account) => ({
                                  address: account.address,
                                  meta: {
                                    name: account.name,
                                    source: wallet.title,
                                    genesisHash: "",
                                  },
                                  type: "sr25519",
                                }))
                              );
                          })
                          .catch(console.error);
                      })
                      .catch(console.error);
                  }}
                  disabled={!wallet.installed}
                >
                  {/* // eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(wallet.logo.src as any)?.src ?? ""}
                    alt={wallet.logo.alt}
                    className="w-8 h-8"
                  />
                  <div className="flex justify-between flex-grow">
                    <div>{wallet.title}</div>{" "}
                    {!wallet.installed && (
                      <div>
                        <a
                          className="block text-purple-400"
                          href={wallet.installUrl}
                          target="_blank"
                        >
                          Install
                        </a>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-y-4 max-h-[280px] overflow-y-scroll no-scrollbar">
          {wallets.length === 0 && (
            <div className="text-center w-[488px]">No Account found</div>
          )}

          {wallets.map((item) => (
            <button
              type="button"
              key={item.address}
              className={`border-[1px] text-sm rounded-xl ${
                selectedAccount === item ? "bg-green-50" : ""
              } p-4 px-3 cursor-pointer shadow-md flex items-center gap-x-3`}
              onClick={() => setSelectedAccount(item)}
            >
              {
                <BiCheckCircle
                  size={30}
                  className={`${
                    selectedAccount === item ? "text-green-400" : "text-gray-400"
                  }`}
                />
              }{" "}
              <div
                className={`text-start ${
                  selectedAccount == item ? "text-primary" : ""
                }`}
              >
                <p className={`font-semibold `}>{item.meta.name}</p>
                {item.address}
              </div>
            </button>
          ))}
        </div>
      </div>
      {(isConnected || wallets.length > 0) && (
        <div className="">
          <button
            type="button"
            className="transform- flex items-center gap-x-2 ease-in-out duration-300 transition-all  text-sm px-3 py-3 font-medium tracking-tight sm:text-md rounded-2xl bg-button border-2  border-white text-white hover:!bg-none hover:border-2 hover:border-purple hover:text-purple disabled:opacity-50 disabled:!bg-button disabled:!border-none disabled:!text-white disabled:cursor-not-allowed w-full justify-center"
            onClick={() => {
              if (!selectedAccount) {
                // infoToast("Select at least one wallet!") 
                return;
              }
              window.localStorage.setItem(
                "selectedCommuneExtension",
                extensionSelected?.title || ""
              );
              handleWalletSelections(
                selectedAccount as InjectedAccountWithMeta
              );
              setOpen(false);
            }}
          >
            Select Wallet
          </button>
        </div>
      )}
    </Modal>
  );
};

export default WalletModal;
