import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

export type PaginatorVarsType = {
  currPageIndex: number;
  itemPerPage: number;
  itemTotal: number;
};

export function PaginatorOffset(v: PaginatorVarsType) {
  return (v.currPageIndex - 1) * v.itemPerPage;
}

type PaginatorProps = {
  vars: PaginatorVarsType;
  handleVarsChanged: Function;
};

function* range(start, end) {
  yield start;
  if (start === end) return;
  yield* range(start + 1, end);
}

export default function Paginator({ vars, handleVarsChanged }: PaginatorProps) {
  const { register, setValue, getValues } = useForm({
    defaultValues: { count: vars.itemPerPage },
  });
  const [PItems, SetPItems] = useState([1]);

  useEffect(() => {
    function checkAndSet(ppc) {
      if (ppc !== +getValues('count')) setValue('count', ppc);
    }
    checkAndSet(vars.itemPerPage);
  }, [getValues, vars.itemPerPage, setValue]);

  const pageTotal = Math.ceil(vars.itemTotal / vars.itemPerPage);

  useEffect(() => {
    if (pageTotal === 0) return;
    let pgItems: any[] = [];
    if (pageTotal > 0 && pageTotal < 7) {
      pgItems = [...range(1, pageTotal)];
    } else {
      pgItems = [...range(1, 3), '...', ...range(pageTotal - 3, pageTotal)];
    }
    const cp = vars.currPageIndex;
    if (pgItems[pgItems.length - 1] !== 0 && !pgItems.includes(cp)) {
      const currRange = [...range(cp - 1, cp + 1)];
      pgItems = [
        1,
        ...[currRange[0] === 2 ? [] : ['...']],
        ...currRange,
        ...[currRange[2] === pageTotal ? [] : ['...']],
        pageTotal,
      ];
    }
    SetPItems(pgItems);
  }, [vars, pageTotal]);

  function handlePrev() {
    // don't activate if this is the first one
    if (vars.currPageIndex === 1) return;

    handleVarsChanged((prev: PaginatorVarsType) => {
      return {
        ...prev,
        currPageIndex:
          prev.currPageIndex > 2 ? prev.currPageIndex - 1 : prev.currPageIndex,
      };
    });
  }

  function handleNext() {
    // don't activate if this is the last one
    if (vars.currPageIndex === PItems[PItems.length - 1]) return;

    handleVarsChanged((prev: PaginatorVarsType) => {
      return {
        ...prev,
        currPageIndex:
          prev.currPageIndex < pageTotal
            ? prev.currPageIndex + 1
            : prev.currPageIndex,
      };
    });
  }

  return (
    <>
      <div className="sm:my-2 bg-slate-200 px-2 sm:py-3 flex items-center justify-between border-0 hover:bg-slate-100 transition py-1 my-1">
        <div className="">
          <select
            className="form-select rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            {...register('count', {
              required: true,
              onChange: () => {
                handleVarsChanged((prev) => {
                  return {
                    ...prev,
                    itemPerPage: +getValues('count'),
                  };
                });
              },
            })}
          >
            <option value="5">5 รายการ/หน้า</option>
            <option value="10">10 รายการ/หน้า</option>
            <option value="20">20 รายการ/หน้า</option>
            <option value="30">30 รายการ/หน้า</option>
          </select>
        </div>
        <div className="flex-1 flex justify-center space-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={handlePrev}
          >
            Previous
          </a>
          <a
            href="#"
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleNext}
          >
            Next
          </a>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:flex-row-reverse sm:items-center">
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={handlePrev}
              >
                <span className="sr-only">Previous</span>＜
              </a>
              {PItems.map((i, ind) => (
                <a
                  key={`pgnt-${ind}`}
                  href="#"
                  aria-current="page"
                  className={`bg-white ${
                    vars.currPageIndex === i
                      ? 'bg-indigo-50 text-blue-600 z-10 border-blue-500'
                      : ' border-gray-300 text-gray-500 hover:bg-gray-50'
                  } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                  onClick={() => {
                    handleVarsChanged((prev: PaginatorVarsType) => {
                      return {
                        ...prev,
                        currPageIndex: i,
                      };
                    });
                  }}
                >
                  {i}
                </a>
              ))}
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={handleNext}
              >
                <span className="sr-only">Next</span>＞
              </a>
            </nav>
          </div>

          <div className="mx-1 hidden lg:flex-1 lg:flex lg:justify-center">
            <p className="text-sm text-gray-700">
              <span className="font-bold">{vars.currPageIndex}</span> to{' '}
              <span className="font-medium">{pageTotal}</span> of{' '}
              <span className="font-medium">{vars.itemTotal}</span> results
            </p>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-700 text-center sm:hidden">
        <span className="font-medium">หน้า {vars.currPageIndex}</span> จาก{' '}
        <span className="font-medium">{pageTotal}</span>{' '}
        <span className="font-medium">({vars.itemTotal}</span> results)
      </div>
    </>
  );
}
