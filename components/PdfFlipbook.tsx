"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const HTMLFlipBook = dynamic(() => import("react-pageflip").then((mod) => mod.default), {
  ssr: false,
}) as any;

type PdfFlipbookProps = {
  file: string;
  title: string;
};

function PdfFlipbook({ file, title }: PdfFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(420);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenWidth, setFullscreenWidth] = useState(900);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const containerWidth = viewerRef.current?.clientWidth ?? viewportWidth;

      const availableWidth = Math.max(containerWidth - 32, 260);
      const mobile = viewportWidth < 768;

      setIsMobile(mobile);

      if (mobile) {
        setPageWidth(Math.min(availableWidth, 360));
      } else {
        // IMPORTANT:
        // Pe desktop react-pageflip afișează 2 pagini,
        // deci lățimea unei pagini trebuie să fie sub jumătate din container.
        const singlePageWidth = Math.floor((availableWidth - 24) / 2);
        setPageWidth(Math.min(singlePageWidth, 300));
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);

    if (viewerRef.current) {
      resizeObserver.observe(viewerRef.current);
    }

    window.addEventListener("resize", updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  useEffect(() => {
    const updateFullscreenWidth = () => {
      setFullscreenWidth(window.innerWidth);
    };

    updateFullscreenWidth();
    window.addEventListener("resize", updateFullscreenWidth);

    return () => window.removeEventListener("resize", updateFullscreenWidth);
  }, []);

  const pageHeight = Math.round(pageWidth * 1.42);

  const fullscreenPageWidth = isMobile
    ? Math.min(fullscreenWidth - 48, 520)
    : Math.min(Math.floor((fullscreenWidth - 160) / 2), 520);

  const fullscreenPageHeight = Math.round(fullscreenPageWidth * 1.42);

  const pages = useMemo(() => {
    return Array.from({ length: numPages }, (_, index) => index + 1);
  }, [numPages]);

  const onLoadSuccess = (document: PDFDocumentProxy) => {
    setNumPages(document.numPages);
  };

  return (
    <>
      <div className="rounded-xl border border-fg/10 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fg/10 bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-medium text-fg">{title}</p>
            <p className="text-xs text-fg/60">
              {numPages ? `${numPages} pagini` : "Se încarcă PDF-ul..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="rounded-full border border-fg/15 px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-fg/5"
            >
              Fullscreen
            </button>

            <a
              href={file}
              download
              className="rounded-full border border-fg/15 px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-fg/5"
            >
              Descarcă PDF
            </a>
          </div>
        </div>

      <div ref={viewerRef} className="bg-white p-4">
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess as any}
          loading={
            <div className="flex h-[420px] items-center justify-center text-sm text-fg/60">
              Se încarcă PDF-ul...
            </div>
          }
          error={
            <div className="flex h-[420px] items-center justify-center text-sm text-red-600">
              PDF-ul nu a putut fi încărcat.
            </div>
          }
        >
          {isMobile ? (
            <div className="mx-auto flex max-h-[620px] flex-col gap-4 overflow-y-auto overflow-x-hidden">
              {pages.map((pageNumber) => (
                <div
                  key={pageNumber}
                  className="mx-auto flex w-full justify-center rounded-lg border border-fg/10 bg-white p-2 shadow-sm"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.max(pageWidth - 16, 240)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full justify-center overflow-hidden py-4">
              {numPages > 0 && (
                <HTMLFlipBook
                  width={pageWidth}
                  height={pageHeight}
                  size="fixed"
                  minWidth={220}
                  maxWidth={320}
                  minHeight={300}
                  maxHeight={520}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="mx-auto shadow-xl"
                  style={{ maxWidth: "100%" }}
                  startPage={0}
                  drawShadow={true}
                  flippingTime={700}
                  usePortrait={false}
                  startZIndex={0}
                  autoSize={false}
                  maxShadowOpacity={0.25}
                  clickEventForward={true}
                  useMouseEvents={true}
                  swipeDistance={30}
                  showPageCorners={true}
                  disableFlipByClick={false}
                >
                  {pages.map((pageNumber) => (
                    <div
                      key={pageNumber}
                      className="flex h-full w-full items-center justify-center bg-white p-1"
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={Math.max(pageWidth - 8, 200)}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              )}
            </div>
          )}
        </Document>
      </div>
    </div>

    {isFullscreen && (
      <div className="fixed inset-0 z-[9999] bg-black/80 p-4">
        <div className="mx-auto flex h-full max-w-7xl flex-col rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-fg/10 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-fg">{title}</p>
              <p className="text-xs text-fg/60">
                {numPages ? `${numPages} pagini` : "Se încarcă PDF-ul..."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={file}
                download
                className="rounded-full border border-fg/15 px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-fg/5"
              >
                Descarcă PDF
              </a>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="rounded-full border border-fg/15 px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-fg/5"
              >
                Închide
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
            <Document
              file={file}
              onLoadSuccess={onLoadSuccess as any}
              loading={
                <div className="flex h-[420px] items-center justify-center text-sm text-fg/60">
                  Se încarcă PDF-ul...
                </div>
              }
              error={
                <div className="flex h-[420px] items-center justify-center text-sm text-red-600">
                  PDF-ul nu a putut fi încărcat.
                </div>
              }
            >
              {isMobile ? (
                <div className="mx-auto flex max-h-full flex-col gap-4 overflow-y-auto overflow-x-hidden">
                  {pages.map((pageNumber) => (
                    <div
                      key={pageNumber}
                      className="mx-auto flex w-full justify-center rounded-lg border border-fg/10 bg-white p-2 shadow-sm"
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={Math.min(fullscreenWidth - 48, 520)}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center overflow-hidden">
                  {numPages > 0 && (
                    <HTMLFlipBook
                      width={fullscreenPageWidth}
                      height={fullscreenPageHeight}
                      size="fixed"
                      autoSize={false}
                      usePortrait={false}
                      className="mx-auto shadow-xl"
                      style={{}}
                      startPage={0}
                      drawShadow={true}
                      flippingTime={700}
                      startZIndex={0}
                      maxShadowOpacity={0.25}
                      clickEventForward={true}
                      useMouseEvents={true}
                      swipeDistance={30}
                      showPageCorners={true}
                      disableFlipByClick={false}
                      showCover={true}
                      mobileScrollSupport={true}
                      minWidth={300}
                      maxWidth={600}
                      minHeight={420}
                      maxHeight={840}
                    >
                      {pages.map((pageNumber) => (
                        <div
                          key={pageNumber}
                          className="flex h-full w-full items-center justify-center bg-white p-2"
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={Math.max(fullscreenPageWidth - 16, 280)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </div>
                      ))}
                    </HTMLFlipBook>
                  )}
                </div>
              )}
            </Document>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default PdfFlipbook;