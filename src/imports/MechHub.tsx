import svgPaths from "./svg-ie268o2jfk";

function Section() {
    return <div className="h-[827.429px] shrink-0 w-0" data-name="Section" />;
}

function Icon() {
    return (
        <div className="relative shrink-0 size-[18px]" data-name="Icon">
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 18 18"
            >
                <g id="Icon">
                    <path
                        d="M3.75 9H14.25"
                        id="Vector"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                    />
                    <path
                        d="M9 3.75V14.25"
                        id="Vector_2"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                    />
                </g>
            </svg>
        </div>
    );
}

function Text() {
    return (
        <div
            className="h-[31.429px] relative shrink-0 w-[66px]"
            data-name="Text"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold','Noto_Sans_KR:Bold','Noto_Sans_SC:Bold',sans-serif] font-bold leading-[31.429px] left-[33px] not-italic text-[22px] text-center text-white top-[0.29px] translate-x-[-50%]">
                    新对话
                </p>
            </div>
        </div>
    );
}

function Button() {
    return (
        <div
            className="bg-black h-[43.429px] relative rounded-[19174000px] shadow-[0px_10px_15px_-3px_#e2e8f0,0px_4px_6px_-4px_#e2e8f0] shrink-0 w-full"
            data-name="Button"
        >
            <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex gap-[8px] items-center justify-center relative size-full">
                    <Icon />
                    <Text />
                </div>
            </div>
        </div>
    );
}

function Heading2() {
    return (
        <div
            className="h-[16px] relative shrink-0 w-full"
            data-name="Heading 3"
        >
            <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold','Noto_Sans_KR:Bold','Noto_Sans_SC:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#90a1b9] text-[12px] top-[0.57px] tracking-[0.6px] uppercase">
                最近对话
            </p>
        </div>
    );
}

function Container() {
    return (
        <div
            className="absolute content-stretch flex flex-col gap-[32px] h-[192.929px] items-start left-0 pt-[24px] px-[24px] top-0 w-[279.429px]"
            data-name="Container"
        >
            <Button />
            <Heading2 />
        </div>
    );
}

function Container1() {
    return (
        <div
            className="h-[52px] relative shrink-0 w-full"
            data-name="Container"
        >
            <p className="absolute css-ew64yg font-['Inter:Regular','Noto_Sans_SC:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[20px] left-[115.71px] not-italic text-[#90a1b9] text-[14px] text-center top-[16.14px] translate-x-[-50%]">
                暂无历史记录
            </p>
        </div>
    );
}

function Container2() {
    return (
        <div
            className="absolute content-stretch flex flex-col h-[293.786px] items-start left-[-15px] overflow-clip pt-[8px] px-[24px] top-[128px] w-[279.429px]"
            data-name="Container"
        >
            <Container1 />
        </div>
    );
}

function Container3() {
    return (
        <div
            className="absolute h-[172.143px] left-0 top-[486.71px] w-[279.429px]"
            data-name="Container"
        />
    );
}

function ImageChendaile() {
    return (
        <div
            className="h-[36.571px] relative shrink-0 w-full"
            data-name="Image (chendaile)"
        >
            <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            />
        </div>
    );
}

function Container4() {
    return (
        <div
            className="bg-[#e2e8f0] relative rounded-[19174000px] shrink-0 size-[40px]"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.714px] relative rounded-[inherit] size-full">
                <ImageChendaile />
            </div>
            <div
                aria-hidden="true"
                className="absolute border-[1.714px] border-solid border-white inset-0 pointer-events-none rounded-[19174000px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
            />
        </div>
    );
}

function Container5() {
    return (
        <div
            className="h-[20px] overflow-clip relative shrink-0 w-full"
            data-name="Container"
        >
            <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#1d293d] text-[14px] top-[0.14px]">
                chendaile
            </p>
        </div>
    );
}

function Container6() {
    return (
        <div
            className="h-[15px] overflow-clip relative shrink-0 w-full"
            data-name="Container"
        >
            <p className="absolute css-ew64yg font-['Inter:Medium','Noto_Sans_JP:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#90a1b9] text-[10px] top-[0.14px] tracking-[0.25px] uppercase">
                机械工程专业学生
            </p>
        </div>
    );
}

function Container7() {
    return (
        <div
            className="flex-[1_0_0] h-[35px] min-h-px min-w-px relative"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
                <Container5 />
                <Container6 />
            </div>
        </div>
    );
}

function Icon1() {
    return (
        <div className="relative shrink-0 size-[16px]" data-name="Icon">
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 16 16"
            >
                <g id="Icon">
                    <path
                        d={svgPaths.p1e124b00}
                        id="Vector"
                        stroke="var(--stroke-0, #CAD5E2)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.33333"
                    />
                    <path
                        d={svgPaths.p28db2b80}
                        id="Vector_2"
                        stroke="var(--stroke-0, #CAD5E2)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.33333"
                    />
                </g>
            </svg>
        </div>
    );
}

function Button1() {
    return (
        <div
            className="h-[56px] relative rounded-[16.4px] shrink-0 w-full"
            data-name="Button"
        >
            <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center px-[8px] relative size-full">
                    <Container4 />
                    <Container7 />
                    <Icon1 />
                </div>
            </div>
        </div>
    );
}

function Container8() {
    return (
        <div
            className="absolute content-stretch flex flex-col h-[88.571px] items-start left-[8px] pt-[16.571px] px-[16px] top-[666.86px] w-[263.429px]"
            data-name="Container"
        >
            <div
                aria-hidden="true"
                className="absolute border-[#f1f5f9] border-solid border-t-[0.571px] inset-0 pointer-events-none"
            />
            <Button1 />
        </div>
    );
}

function Container9() {
    return (
        <div
            className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[280px]"
            data-name="Container"
        >
            <div
                aria-hidden="true"
                className="absolute border-[#f1f5f9] border-r-[0.571px] border-solid inset-0 pointer-events-none"
            />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <Container />
                <Container2 />
                <Container3 />
                <Container8 />
            </div>
        </div>
    );
}

function Icon2() {
    return (
        <div
            className="absolute left-[16px] size-[14px] top-[9px]"
            data-name="Icon"
        >
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14 14"
            >
                <g id="Icon">
                    <path
                        d={svgPaths.p17395980}
                        id="Vector"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                    <path
                        d="M12.25 7H5.25"
                        id="Vector_2"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                    <path
                        d={svgPaths.p2be9bb00}
                        id="Vector_3"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                </g>
            </svg>
        </div>
    );
}

function Button2() {
    return (
        <div
            className="h-[32px] relative rounded-[10px] shrink-0 w-full"
            data-name="Button"
        >
            <Icon2 />
            <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-bold leading-[16px] left-[62px] not-italic text-[#90a1b9] text-[12px] text-center top-[8.57px] translate-x-[-50%]">
                退出登录
            </p>
        </div>
    );
}

function Container10() {
    return (
        <div
            className="bg-white h-[64px] relative shrink-0 w-[280px]"
            data-name="Container"
        >
            <div
                aria-hidden="true"
                className="absolute border-[#f1f5f9] border-r-[0.571px] border-solid inset-0 pointer-events-none"
            />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[16px] pr-[16.571px] pt-[16px] relative size-full">
                <Button2 />
            </div>
        </div>
    );
}

function Container11() {
    return (
        <div
            className="h-[827.429px] relative shrink-0 w-[280px]"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
                <Container9 />
                <Container10 />
            </div>
        </div>
    );
}

function Icon3() {
    return (
        <div
            className="h-[25.742px] overflow-clip relative shrink-0 w-full"
            data-name="Icon"
        >
            <div className="absolute inset-[8.41%_12.68%]" data-name="Vector">
                <div className="absolute inset-[-5.01%_-5.58%]">
                    <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 21.3578 23.5581"
                    >
                        <path
                            d={svgPaths.p18817300}
                            id="Vector"
                            stroke="var(--stroke-0, black)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.14514"
                        />
                    </svg>
                </div>
            </div>
            <div className="absolute inset-[37.5%]" data-name="Vector">
                <div className="absolute inset-[-16.67%]">
                    <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 8.58057 8.58057"
                    >
                        <path
                            d={svgPaths.p23ad68d0}
                            id="Vector"
                            stroke="var(--stroke-0, black)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.14514"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function Container12() {
    return (
        <div className="relative size-[25.742px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
                <Icon3 />
            </div>
        </div>
    );
}

function Container13() {
    return (
        <div
            className="bg-white relative rounded-[19174000px] shrink-0 size-[40px]"
            data-name="Container"
        >
            <div
                aria-hidden="true"
                className="absolute border-[#f1f5f9] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[19174000px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
            />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[0.571px] relative size-full">
                <div
                    className="flex items-center justify-center relative shrink-0 size-[33.132px]"
                    style={
                        {
                            "--transform-inner-width": "300",
                            "--transform-inner-height": "300",
                        } as React.CSSProperties
                    }
                >
                    <div className="flex-none rotate-[159.48deg]">
                        <Container12 />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Text1() {
    return (
        <div
            className="h-[32px] relative shrink-0 w-[150.455px]"
            data-name="Text"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-0 not-italic text-[#0f172b] text-[24px] top-[-0.86px] w-[151px]">
                    Hi, chendaile
                </p>
            </div>
        </div>
    );
}

function Container14() {
    return (
        <div
            className="h-[40px] relative shrink-0 w-[202.455px]"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
                <Container13 />
                <Text1 />
            </div>
        </div>
    );
}

function Text2() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-0 top-[1.71px] w-[49.661px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                W
            </p>
        </div>
    );
}

function Text3() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[49.66px] top-[1.71px] w-[31.607px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                h
            </p>
        </div>
    );
}

function Text4() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[81.27px] top-[1.71px] w-[26.161px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                e
            </p>
        </div>
    );
}

function Text5() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[107.43px] top-[1.71px] w-[22.705px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                r
            </p>
        </div>
    );
}

function Text6() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[130.13px] top-[1.71px] w-[26.161px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                e
            </p>
        </div>
    );
}

function Text7() {
    return (
        <div
            className="absolute h-[70.857px] left-[156.29px] top-[1.71px] w-[9.929px]"
            data-name="Text"
        />
    );
}

function Text8() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[166.22px] top-[1.71px] w-[22.705px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                s
            </p>
        </div>
    );
}

function Text9() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[188.93px] top-[1.71px] w-[31.607px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                h
            </p>
        </div>
    );
}

function Text10() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[220.54px] top-[1.71px] w-[28.857px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                o
            </p>
        </div>
    );
}

function Text11() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[249.39px] top-[1.71px] w-[31.554px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                u
            </p>
        </div>
    );
}

function Text12() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[280.95px] top-[1.71px] w-[16.375px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                l
            </p>
        </div>
    );
}

function Text13() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[297.32px] top-[1.71px] w-[31.554px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                d
            </p>
        </div>
    );
}

function Text14() {
    return (
        <div
            className="absolute h-[70.857px] left-[328.88px] top-[1.71px] w-[9.929px]"
            data-name="Text"
        />
    );
}

function Text15() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[338.8px] top-[1.71px] w-[39.634px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                w
            </p>
        </div>
    );
}

function Text16() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[378.44px] top-[1.71px] w-[26.161px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                e
            </p>
        </div>
    );
}

function Text17() {
    return (
        <div
            className="absolute h-[70.857px] left-[404.6px] top-[1.71px] w-[9.929px]"
            data-name="Text"
        />
    );
}

function Text18() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[414.53px] top-[1.71px] w-[22.705px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                s
            </p>
        </div>
    );
}

function Text19() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[437.23px] top-[1.71px] w-[18.955px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                t
            </p>
        </div>
    );
}

function Text20() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[456.19px] top-[1.71px] w-[27.161px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                a
            </p>
        </div>
    );
}

function Text21() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[483.35px] top-[1.71px] w-[22.705px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                r
            </p>
        </div>
    );
}

function Text22() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[506.05px] top-[1.71px] w-[18.955px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                t
            </p>
        </div>
    );
}

function Text23() {
    return (
        <div
            className="absolute content-stretch flex h-[70.857px] items-start left-[525.01px] top-[1.71px] w-[25.688px]"
            data-name="Text"
        >
            <p className="css-ew64yg font-['Abhaya_Libre:Bold',sans-serif] leading-[75px] not-italic relative shrink-0 text-[#0f172b] text-[60px] tracking-[-1.5px]">
                ?
            </p>
        </div>
    );
}

function Heading() {
    return (
        <div
            className="h-[75px] relative shrink-0 w-[550.696px]"
            data-name="Heading 1"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <Text2 />
                <Text3 />
                <Text4 />
                <Text5 />
                <Text6 />
                <Text7 />
                <Text8 />
                <Text9 />
                <Text10 />
                <Text11 />
                <Text12 />
                <Text13 />
                <Text14 />
                <Text15 />
                <Text16 />
                <Text17 />
                <Text18 />
                <Text19 />
                <Text20 />
                <Text21 />
                <Text22 />
                <Text23 />
            </div>
        </div>
    );
}

function Container15() {
    return (
        <div
            className="absolute bg-[#e2e8f0] h-[32px] left-[233.71px] top-[18.57px] w-px"
            data-name="Container"
        />
    );
}

function Icon4() {
    return (
        <div className="relative shrink-0 size-[20px]" data-name="Icon">
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20 20"
            >
                <g id="Icon">
                    <path
                        d={svgPaths.p1cec7ff0}
                        id="Vector"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66667"
                    />
                    <path
                        d={svgPaths.p38772900}
                        id="Vector_2"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66667"
                    />
                    <path
                        d={svgPaths.p27fa8ca0}
                        id="Vector_3"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66667"
                    />
                </g>
            </svg>
        </div>
    );
}

function Button3() {
    return (
        <div
            className="absolute content-stretch flex items-center justify-center left-[246.71px] p-[0.571px] rounded-[19174000px] size-[40px] top-[14.57px]"
            data-name="Button"
        >
            <div
                aria-hidden="true"
                className="absolute border-[0.571px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[19174000px]"
            />
            <Icon4 />
        </div>
    );
}

function TextInput() {
    return (
        <div
            className="absolute content-stretch flex h-[52px] items-center left-[294.71px] overflow-clip px-[8px] py-[12px] top-[8.57px] w-[288.143px]"
            data-name="Text Input"
        >
            <p className="css-ew64yg font-['Inter:Regular','Noto_Sans_SC:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[18px]">
                问问你的 AI 学习搭档...
            </p>
        </div>
    );
}

function Icon5() {
    return (
        <div className="relative shrink-0 size-[20px]" data-name="Icon">
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20 20"
            >
                <g id="Icon">
                    <path
                        d="M4.16667 10H15.8333"
                        id="Vector"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66667"
                    />
                    <path
                        d={svgPaths.p1ae0b780}
                        id="Vector_2"
                        stroke="var(--stroke-0, #90A1B9)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66667"
                    />
                </g>
            </svg>
        </div>
    );
}

function Button4() {
    return (
        <div
            className="absolute bg-[#e2e8f0] content-stretch flex items-center justify-center left-[590.86px] rounded-[19174000px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] size-[40px] top-[14.57px]"
            data-name="Button"
        >
            <Icon5 />
        </div>
    );
}

function Container16() {
    return (
        <div
            className="absolute bg-[#0f172b] h-[32px] left-[4px] rounded-[20px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[4px] w-[98px]"
            data-name="Container"
        />
    );
}

function Icon6() {
    return (
        <div
            className="absolute left-[27px] size-[14px] top-[9px]"
            data-name="Icon"
        >
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14 14"
            >
                <g id="Icon">
                    <path
                        d={svgPaths.p12ee800}
                        id="Vector"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                    <path
                        d="M12.8333 5.83333V9.33333"
                        id="Vector_2"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                    <path
                        d={svgPaths.p2c334740}
                        id="Vector_3"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                </g>
            </svg>
        </div>
    );
}

function Button5() {
    return (
        <div
            className="absolute h-[32px] left-[4px] rounded-[20px] top-[4px] w-[100px]"
            data-name="Button"
        >
            <Icon6 />
            <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-bold leading-[16px] left-[61px] not-italic text-[12px] text-center text-white top-[8.57px] translate-x-[-50%]">
                提问
            </p>
        </div>
    );
}

function Icon7() {
    return (
        <div
            className="absolute left-[27px] size-[14px] top-[9px]"
            data-name="Icon"
        >
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14 14"
            >
                <g id="Icon">
                    <path
                        d={svgPaths.pd04fc00}
                        id="Vector"
                        stroke="var(--stroke-0, #62748E)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                    />
                </g>
            </svg>
        </div>
    );
}

function Button6() {
    return (
        <div
            className="absolute h-[32px] left-[104px] rounded-[20px] top-[4px] w-[100px]"
            data-name="Button"
        >
            <Icon7 />
            <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold leading-[16px] left-[61px] not-italic text-[#62748e] text-[12px] text-center top-[8.57px] translate-x-[-50%]">
                批改
            </p>
        </div>
    );
}

function Container17() {
    return (
        <div
            className="absolute bg-[rgba(255,255,255,0.8)] border-[#e2e8f0] border-[0.571px] border-solid h-[41.143px] left-[8.57px] rounded-[24px] top-[14px] w-[209.143px]"
            data-name="Container"
        >
            <Container16 />
            <Button5 />
            <Button6 />
        </div>
    );
}

function Form() {
    return (
        <div
            className="bg-[#f8fafc] h-[69.143px] relative rounded-[32px] shrink-0 w-[639.429px]"
            data-name="Form"
        >
            <div
                aria-hidden="true"
                className="absolute border-[#e2e8f0] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
            />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <Container15 />
                <Button3 />
                <TextInput />
                <Button4 />
                <Container17 />
            </div>
        </div>
    );
}

function Icon8() {
    return (
        <div className="relative size-[40.785px]" data-name="Icon">
            <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 40.7854 40.7854"
            >
                <g id="Icon">
                    <path
                        d={svgPaths.p1f2f18c0}
                        id="Vector"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3.39878"
                    />
                    <path
                        d={svgPaths.p14961c00}
                        id="Vector_2"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3.39878"
                    />
                </g>
            </svg>
        </div>
    );
}

function Container18() {
    return (
        <div
            className="bg-black relative rounded-[10px] shrink-0 size-[58px]"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <div
                    className="absolute flex items-center justify-center left-[1.28px] size-[55.448px] top-[8.61px]"
                    style={
                        {
                            "--transform-inner-width": "300",
                            "--transform-inner-height": "150",
                        } as React.CSSProperties
                    }
                >
                    <div className="flex-none rotate-[-150.99deg]">
                        <Icon8 />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Heading1() {
    return (
        <div
            className="absolute h-[50px] left-0 top-0 w-[153.982px]"
            data-name="Heading 1"
        >
            <p className="absolute css-ew64yg font-['Abhaya_Libre:Regular',sans-serif] leading-[50px] left-0 not-italic text-[#1d293d] text-[40px] top-[1.14px] tracking-[-1px]">
                MechHub
            </p>
        </div>
    );
}

function Paragraph() {
    return (
        <div
            className="absolute h-[19.5px] left-0 top-[50px] w-[153.982px]"
            data-name="Paragraph"
        >
            <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[#90a1b9] text-[13px] top-[0.71px] tracking-[1.3px] uppercase">
                学生版
            </p>
        </div>
    );
}

function Container19() {
    return (
        <div
            className="h-[69.5px] relative shrink-0 w-[153.982px]"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <Heading1 />
                <Paragraph />
            </div>
        </div>
    );
}

function Container20() {
    return (
        <div
            className="absolute left-[17px] top-0 w-[646px]"
            data-name="Container"
        >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative w-full">
                <Container18 />
                <Container19 />
                <p className="absolute css-ew64yg font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[normal] left-[634px] not-italic text-[12px] text-black top-[35px]">
                    首页
                </p>
            </div>
        </div>
    );
}

function MainContent() {
    return (
        <div
            className="bg-white flex-[1_0_0] min-h-px min-w-px relative"
            data-name="Main Content"
        >
            <div className="overflow-clip rounded-[inherit] size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pl-[57px] pt-[311.143px] relative w-full">
                    <Container14 />
                    <Heading />
                    <Form />
                    <Container20 />
                </div>
            </div>
        </div>
    );
}

export default function MechHub() {
    return (
        <div
            className="bg-white content-stretch flex items-start relative size-full"
            data-name="MechHub"
        >
            <Section />
            <Container11 />
            <MainContent />
        </div>
    );
}
