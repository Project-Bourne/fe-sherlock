import React, { useState } from "react";
import Image from "next/image";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const ActionIcons = ({ docId }) => {
  const router = useRouter();
  const { userInfo } = useSelector((state: any) => state?.auth);
  const BASE_URL = `http://${process.env.NEXT_PUBLIC_SERVER_IP_ADDRESS}`;

  const permissions = userInfo?.role?.permissions;

  const handleExport = (id: string, to: string) => {
    if (to === "collab") {
      // router?.push(`http://localhost:3001/document/${id}&analyser`);
      router?.push(`${BASE_URL}:${process.env.NEXT_PUBLIC_COLLAB_PORT}/document/${id}&analyser`);
    }
    if (to === "summarizer") {
      // router?.push(`http://192.81.213.226:32/home/${id}&analyser`);
      router?.push(`${BASE_URL}:${process.env.NEXT_PUBLIC_SUMMARIZER_PORT}/home/${id}&analyser`);
    }
    if (to === "factcheck") {
      // router?.push(`http://192.81.213.226:34/home/${id}&analyser`);
      router?.push(`${BASE_URL}:${process.env.NEXT_PUBLIC_FACT_CHECKER_PORT}/home/${id}&analyser`);
    }
    if (to === "deepchat") {
      // router?.push(`http://192.81.213.226:35/home/${id}&analyser`);
      router?.push(`${BASE_URL}:${process.env.NEXT_PUBLIC_DEEP_CHAT_PORT}/home/${id}&analyser`);
    }
    if (to === "interrogator") {
       // router?.push(`http://localhost:3001/home/query/${id}&analyser`);
      router?.push(`${BASE_URL}:${process.env.NEXT_PUBLIC_INTERROGATOR_PORT}/home/query/${id}&analyser`);
    }
    if (to === "translator") {
      // // router?.push(`http://localhost:3001/home/${id}&analyser`);
      router?.push(`${BASE_URL}:${process.env.NEXT_PUBLIC_TRANSLATOR_PORT}/home/${id}&analyser`);
    }
    // if (to === "interrogator") {
    //   router?.push(`http://localhost:3001/home/query/${id}&analyser`);
    // }
    
  };

  return (
    <>
      <div className="flex flex-row justify-end gap-[0.5rem] mr-5">
        {/* collab */}
        {permissions?.includes("collab") && (
          <Tooltip title="Export to Collab">
            <Image
              src={require("../../../../../public/icons/action_collab.svg")}
              alt="documents"
              className=" cursor-pointer"
              width={60}
              onClick={() => handleExport(docId, "collab")}
            />
          </Tooltip>
        )}
        {/* factcheck */}
        {permissions?.includes("fact checker") && (
          <Tooltip title="Export to Factchecker">
            <Image
              src={require("../../../../../public/icons/action_factchecker.svg")}
              alt="documents"
              className="cursor-pointer"
              onClick={() => handleExport(docId, "factcheck")}
              width={60}
            />
          </Tooltip>
        )}

        {/* analyzer */}
        {permissions?.includes("summarizer") && (
          <Tooltip title="Export to Summarizer">
            <Image
              src={require("../../../../../public/icons/action_summarizer.svg")}
              alt="documents"
              className=" cursor-pointer"
              onClick={() => handleExport(docId, "summarizer")}
              width={60}
            />
          </Tooltip>
        )}

        {/* translator */}
        {permissions?.includes("translator") && (
          <Tooltip title="Export to Translator">
            <Image
              src={require("../../../../../public/icons/action_translator.svg")}
              alt="documents"
              className="cursor-pointer"
              onClick={() => handleExport(docId, "translator")}
              width={60}
            />
          </Tooltip>
        )}

        {/* deepchat */}
        {permissions?.includes("deep chat") && (
          <Tooltip title="Export to Deep chat">
            <Image
              src={require("../../../../../public/icons/action_deepchat.svg")}
              alt="documents"
              className="cursor-pointer"
              onClick={() => handleExport(docId, "deepchat")}
              width={60}
            />
          </Tooltip>
        )}

        {/* interrogator */}
        {permissions?.includes("interrogator") && (
          <Tooltip title="Export to Interrogator">
            <Image
              src={require("../../../../../public/icons/action_interrogator.svg")}
              alt="documents"
              className="cursor-pointer"
              onClick={() => handleExport(docId, "interrogator")}
              width={60}
            />
          </Tooltip>
        )}
      </div>
    </>
  );
};

export default ActionIcons;
