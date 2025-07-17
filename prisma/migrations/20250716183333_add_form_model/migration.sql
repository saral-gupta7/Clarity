-- CreateTable
CREATE TABLE "Form" (
    "formId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publicUrl" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("formId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_publicUrl_key" ON "Form"("publicUrl");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
